import { computed, onMounted, ref } from 'vue';
import {
  EMPTY,
  NOT_FROM_JS,
  SERVER_ONLY,
  fnv1aHex,
  formatBytes,
  formatUtcOffset,
  hashComponents,
  type FingerprintComponentValue,
  type FingerprintItem,
  type FingerprintSection,
  type FingerprintStatus,
} from '@/utils/fingerprint';

/**
 * Collects everything the browser is willing to show to JavaScript.
 * Nothing is sent anywhere: no external requests, no storage writes.
 * Signals that need a server (IP, TLS, TCP/IP) are declared as such
 * instead of being faked.
 *
 * Runs on mount only — SSR renders the empty state and never touches `window`.
 */

export type FingerprintState = 'idle' | 'collecting' | 'ready' | 'error';

type Components = Record<string, FingerprintComponentValue>;

interface UaBrand {
  brand: string;
  version: string;
}

interface NavigatorFingerprint {
  userAgent?: string;
  platform?: string;
  vendor?: string;
  language?: string;
  languages?: string[];
  cookieEnabled?: boolean;
  doNotTrack?: string | null;
  webdriver?: boolean;
  hardwareConcurrency?: number;
  maxTouchPoints?: number;
  pdfViewerEnabled?: boolean;
  deviceMemory?: number;
  userAgentData?: { brands: UaBrand[]; platform: string; mobile: boolean };
  connection?: { effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean };
  storage?: { estimate?: () => Promise<{ usage?: number; quota?: number }> };
  mediaDevices?: { enumerateDevices?: () => Promise<Array<{ kind: string; label: string }>> };
  getBattery?: () => Promise<{ level: number; charging: boolean }>;
  getGamepads?: () => Array<unknown>;
}

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

/** Fonts probed by width comparison against the fallback fonts. */
const TEST_FONTS = [
  'Arial',
  'Arial Black',
  'Book Antiqua',
  'Calibri',
  'Cambria',
  'Candara',
  'Comic Sans MS',
  'Consolas',
  'Constantia',
  'Corbel',
  'Courier New',
  'DejaVu Sans',
  'Fira Code',
  'Franklin Gothic Medium',
  'Gabriola',
  'Garamond',
  'Georgia',
  'Helvetica',
  'Helvetica Neue',
  'Impact',
  'JetBrains Mono',
  'Liberation Sans',
  'Lucida Console',
  'Lucida Grande',
  'Menlo',
  'Microsoft Sans Serif',
  'Monaco',
  'Noto Sans',
  'Palatino Linotype',
  'PT Sans',
  'Roboto',
  'Segoe Print',
  'Segoe Script',
  'Segoe UI',
  'SF Pro Text',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Ubuntu',
  'Verdana',
];

const BASE_FONTS = ['monospace', 'sans-serif', 'serif'] as const;

const CODEC_TESTS: Array<{ label: string; type: string; kind: 'video' | 'audio' }> = [
  { label: 'video h264', type: 'video/mp4; codecs="avc1.42E01E"', kind: 'video' },
  { label: 'video hevc', type: 'video/mp4; codecs="hev1.1.6.L93.B0"', kind: 'video' },
  { label: 'video vp9', type: 'video/webm; codecs="vp9"', kind: 'video' },
  { label: 'video av1', type: 'video/webm; codecs="av01.0.05M.08"', kind: 'video' },
  { label: 'audio mp3', type: 'audio/mpeg', kind: 'audio' },
  { label: 'audio aac', type: 'audio/aac', kind: 'audio' },
  { label: 'audio opus', type: 'audio/webm; codecs="opus"', kind: 'audio' },
  { label: 'audio vorbis', type: 'audio/ogg; codecs="vorbis"', kind: 'audio' },
];

function getNavigator(): NavigatorFingerprint {
  return navigator as unknown as NavigatorFingerprint;
}

function text(value: unknown): string {
  if (value === null || value === undefined || value === '') return EMPTY;
  return String(value);
}

function withTimeout<T>(promise: Promise<T> | undefined, ms: number): Promise<T | null> {
  if (!promise) return Promise.resolve(null);
  const timeout = new Promise<null>((resolve) => {
    setTimeout(() => resolve(null), ms);
  });
  return Promise.race([promise, timeout]).catch(() => null);
}

/** One canvas for 2d signals, one for WebGL: a canvas can only have a single context type. */
let canvas2d: HTMLCanvasElement | null = null;
let canvasGl: HTMLCanvasElement | null = null;

function getCanvas2d(): HTMLCanvasElement {
  canvas2d ??= document.createElement('canvas');
  return canvas2d;
}

function getCanvasGl(): HTMLCanvasElement {
  canvasGl ??= document.createElement('canvas');
  return canvasGl;
}

function glParam(gl: WebGLRenderingContext, pname: number): string {
  try {
    const value = gl.getParameter(pname);
    if (value === null || value === undefined) return EMPTY;
    if (Array.isArray(value) || ArrayBuffer.isView(value)) {
      return Array.from(value as ArrayLike<number>).join(' × ');
    }
    return String(value);
  } catch {
    return EMPTY;
  }
}

function mediaSignalChips(): string[] {
  const matches = (query: string) => window.matchMedia(query).matches;
  return [
    `color-scheme: ${matches('(prefers-color-scheme: dark)') ? 'dark' : matches('(prefers-color-scheme: light)') ? 'light' : 'no-preference'}`,
    `reduced-motion: ${matches('(prefers-reduced-motion: reduce)') ? 'reduce' : 'no-preference'}`,
    `contrast: ${matches('(prefers-contrast: more)') ? 'more' : matches('(prefers-contrast: less)') ? 'less' : 'no-preference'}`,
    `forced-colors: ${matches('(forced-colors: active)') ? 'active' : 'none'}`,
    `gamut: ${matches('(color-gamut: p3)') ? 'p3' : matches('(color-gamut: srgb)') ? 'srgb' : 'limited'}`,
    `pointer: ${matches('(any-pointer: coarse)') ? 'coarse' : matches('(any-pointer: fine)') ? 'fine' : 'none'}`,
    `hover: ${matches('(any-hover: hover)') ? 'hover' : 'none'}`,
    `dynamic-range: ${matches('(dynamic-range: high)') ? 'high' : 'standard'}`,
    `inverted-colors: ${matches('(inverted-colors: inverted)') ? 'inverted' : 'none'}`,
  ];
}

function detectFonts(ctx: CanvasRenderingContext2D): string[] {
  const sample = 'mmmmmmmmmmlli';
  const fallbackWidths = new Map<string, number>();
  for (const base of BASE_FONTS) {
    ctx.font = `72px ${base}`;
    fallbackWidths.set(base, ctx.measureText(sample).width);
  }

  const found: string[] = [];
  for (const font of TEST_FONTS) {
    const isInstalled = BASE_FONTS.some((base) => {
      ctx.font = `72px "${font}", ${base}`;
      return ctx.measureText(sample).width !== fallbackWidths.get(base);
    });
    if (isInstalled) found.push(font);
  }
  return found;
}

function drawCanvasProbe(ctx: CanvasRenderingContext2D): void {
  ctx.canvas.width = 300;
  ctx.canvas.height = 70;
  ctx.textBaseline = 'top';
  ctx.font = '16px "Arial"';
  ctx.fillStyle = '#f60';
  ctx.fillRect(0, 0, 120, 40);
  ctx.fillStyle = '#069';
  ctx.fillText('fingerprint, éèй', 2, 15);
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
  ctx.fillText('fingerprint, éèй', 4, 33);
  ctx.globalCompositeOperation = 'multiply';
  ctx.beginPath();
  ctx.arc(60, 45, 28, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = 'rgba(102, 102, 204, 0.85)';
  ctx.beginPath();
  ctx.moveTo(8, 62);
  ctx.lineTo(140, 8);
  ctx.stroke();
}

function collectHttp(): FingerprintSection {
  const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  const navExtras = navigation as (PerformanceNavigationTiming & { deliveryType?: string }) | undefined;
  return {
    id: 'http',
    title: 'HTTP',
    status: 'ok',
    hint: 'What the current navigation reports. Everything wire-level (TLS, frames) is described in the last card.',
    items: [
      { label: 'next hop protocol', value: text(navExtras?.nextHopProtocol) },
      { label: 'delivery type', value: text(navExtras?.deliveryType) },
      { label: 'secure context', value: text(window.isSecureContext) },
      { label: 'cross origin isolated', value: text(window.crossOriginIsolated) },
      { label: 'referrer', value: text(document.referrer) },
      { label: 'page', value: window.location.href },
    ],
  };
}

function collectNetwork(): FingerprintSection {
  const nav = getNavigator();
  const connection = nav.connection;
  return {
    id: 'network',
    title: 'Network',
    status: 'partial',
    hint: 'Your IP is known only to the server that answers the request. JS gets a couple of coarse hints from the Network Information API (Chromium).',
    items: [
      { label: 'ip address', value: NOT_FROM_JS },
      { label: 'effective type', value: text(connection?.effectiveType) },
      {
        label: 'downlink',
        value: connection?.downlink === undefined ? EMPTY : `${connection.downlink} Mb/s`,
      },
      {
        label: 'round trip time',
        value: connection?.rtt === undefined ? EMPTY : `${connection.rtt} ms`,
      },
      { label: 'save data', value: text(connection?.saveData) },
    ],
  };
}

function collectUserAgent(components: Components): FingerprintSection {
  const nav = getNavigator();
  const clientHints = nav.userAgentData;
  components.userAgent = nav.userAgent;
  components.uaBrands = clientHints?.brands.map((entry) => `${entry.brand}/${entry.version}`) ?? [];
  components.languages = nav.languages ?? [];
  return {
    id: 'user-agent',
    title: 'User agent',
    status: clientHints ? 'ok' : 'partial',
    hint: clientHints
      ? 'User-Agent Client Hints: structured data instead of parsing the UA string.'
      : 'No Client Hints here — brands can only be guessed by parsing the UA string.',
    items: [
      { label: 'user agent', value: text(nav.userAgent) },
      { label: 'platform', value: text(clientHints?.platform ?? nav.platform) },
      { label: 'mobile', value: text(clientHints?.mobile) },
      { label: 'vendor', value: text(nav.vendor) },
      { label: 'language', value: text(nav.language) },
    ],
    chips: [
      {
        label: 'client hint brands',
        items: clientHints?.brands.map((entry) => `${entry.brand} ${entry.version}`) ?? [NOT_FROM_JS],
      },
      {
        label: 'languages (preference order)',
        items: nav.languages?.length ? [...nav.languages] : [EMPTY],
      },
    ],
  };
}

async function collectSystem(components: Components): Promise<FingerprintSection> {
  const nav = getNavigator();
  const resolved = Intl.DateTimeFormat().resolvedOptions();
  const platform = nav.userAgentData?.platform ?? nav.platform;

  let storage = EMPTY;
  try {
    const estimate = await nav.storage?.estimate?.();
    if (estimate?.quota) {
      const used = estimate.usage ?? 0;
      const share = (used / estimate.quota) * 100;
      storage = `${formatBytes(used)} of ${formatBytes(estimate.quota)} (${share.toFixed(3)}%)`;
    }
  } catch {
    storage = EMPTY;
  }

  components.platform = platform;
  components.hardwareConcurrency = nav.hardwareConcurrency;
  components.deviceMemory = nav.deviceMemory;
  components.maxTouchPoints = nav.maxTouchPoints;
  components.timezone = resolved.timeZone;
  components.locale = resolved.locale;
  components.utcOffset = formatUtcOffset(new Date().getTimezoneOffset());

  return {
    id: 'system',
    title: 'System',
    status: 'ok',
    items: [
      { label: 'platform', value: text(platform) },
      { label: 'logical cores', value: text(nav.hardwareConcurrency) },
      {
        label: 'device memory',
        value: nav.deviceMemory === undefined ? EMPTY : `${nav.deviceMemory} GB`,
      },
      { label: 'max touch points', value: text(nav.maxTouchPoints) },
      { label: 'cookies enabled', value: text(nav.cookieEnabled) },
      { label: 'do not track', value: text(nav.doNotTrack) },
      { label: 'webdriver', value: text(nav.webdriver) },
      { label: 'pdf viewer', value: text(nav.pdfViewerEnabled) },
      { label: 'timezone', value: text(resolved.timeZone) },
      { label: 'locale', value: text(resolved.locale) },
      { label: 'utc offset', value: formatUtcOffset(new Date().getTimezoneOffset()) },
      { label: 'storage estimate', value: storage },
    ],
  };
}

function collectDisplay(components: Components): FingerprintSection {
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'reduce'
    : 'no-preference';

  components.screen = `${window.screen.width}×${window.screen.height}`;
  components.colorDepth = window.screen.colorDepth;
  components.devicePixelRatio = window.devicePixelRatio;
  components.colorScheme = colorScheme;
  components.reducedMotion = reducedMotion;

  return {
    id: 'display',
    title: 'Display',
    status: 'ok',
    items: [
      { label: 'resolution', value: `${window.screen.width} × ${window.screen.height}` },
      {
        label: 'available',
        value: `${window.screen.availWidth} × ${window.screen.availHeight}`,
      },
      { label: 'color depth', value: `${window.screen.colorDepth} bit` },
      { label: 'pixel depth', value: `${window.screen.pixelDepth} bit` },
      { label: 'device pixel ratio', value: text(window.devicePixelRatio) },
      { label: 'viewport', value: `${window.innerWidth} × ${window.innerHeight}` },
      { label: 'orientation', value: text(window.screen.orientation?.type) },
      { label: 'color scheme', value: colorScheme },
      { label: 'reduced motion', value: reducedMotion },
    ],
    chips: [{ label: 'media queries', items: mediaSignalChips() }],
  };
}

function collectGraphics(components: Components): FingerprintSection {
  const gl = (getCanvasGl().getContext('webgl2') ??
    getCanvasGl().getContext('webgl')) as unknown as WebGLRenderingContext | null;

  if (!gl) {
    return {
      id: 'graphics',
      title: 'Graphics (WebGL)',
      status: 'unavailable',
      items: [{ label: 'webgl context', value: EMPTY }],
      hint: 'WebGL is disabled, blocked by a privacy extension, or the driver is blocklisted.',
    };
  }

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info') as {
    UNMASKED_VENDOR_WEBGL: number;
    UNMASKED_RENDERER_WEBGL: number;
  } | null;

  const vendor = debugInfo ? glParam(gl, debugInfo.UNMASKED_VENDOR_WEBGL) : NOT_FROM_JS;
  const renderer = debugInfo ? glParam(gl, debugInfo.UNMASKED_RENDERER_WEBGL) : NOT_FROM_JS;
  const extensions = gl.getSupportedExtensions() ?? [];

  components.webglVendor = vendor;
  components.webglRenderer = renderer;
  components.glVersion = glParam(gl, gl.VERSION);
  components.glExtensionCount = extensions.length;

  return {
    id: 'graphics',
    title: 'Graphics (WebGL)',
    status: debugInfo ? 'ok' : 'partial',
    hint: 'The GPU string is one of the loudest signals: it survives browser updates and private modes.',
    items: [
      { label: 'unmasked vendor', value: vendor },
      { label: 'unmasked renderer', value: renderer },
      { label: 'vendor', value: glParam(gl, gl.VENDOR) },
      { label: 'renderer', value: glParam(gl, gl.RENDERER) },
      { label: 'gl version', value: glParam(gl, gl.VERSION) },
      { label: 'shading language', value: glParam(gl, gl.SHADING_LANGUAGE_VERSION) },
      { label: 'max texture size', value: glParam(gl, gl.MAX_TEXTURE_SIZE) },
      { label: 'texture units', value: glParam(gl, gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS) },
      { label: 'extensions', value: String(extensions.length) },
    ],
    chips: extensions.length ? [{ label: 'supported extensions', items: extensions }] : undefined,
    note: 'WebGLRenderingContext loses its context after a few dozen probes — re-collecting more than ~15 times in one session will blank this card until reload.',
  };
}

async function probeAudio(): Promise<{ hash: string; sampleRate: number; channels: number }> {
  const scope = window as unknown as {
    OfflineAudioContext?: typeof OfflineAudioContext;
    webkitOfflineAudioContext?: typeof OfflineAudioContext;
  };
  const Ctor = scope.OfflineAudioContext ?? scope.webkitOfflineAudioContext;
  if (!Ctor) return { hash: NOT_FROM_JS, sampleRate: 0, channels: 0 };

  try {
    const ctx = new Ctor(1, 5000, 44100);
    const oscillator = ctx.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 1000;

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.knee.value = 40;
    compressor.ratio.value = 12;
    compressor.attack.value = 0;
    compressor.release.value = 0.25;

    oscillator.connect(compressor);
    compressor.connect(ctx.destination);
    oscillator.start(0);

    const rendered = await ctx.startRendering();
    const channel = rendered.getChannelData(0);
    const sample: string[] = [];
    for (let i = 0; i < channel.length; i += 64) sample.push(channel[i].toFixed(5));
    return {
      hash: fnv1aHex(sample.join(',')),
      sampleRate: rendered.sampleRate,
      channels: rendered.numberOfChannels,
    };
  } catch {
    return { hash: EMPTY, sampleRate: 0, channels: 0 };
  }
}

async function collectCanvasAudio(components: Components): Promise<FingerprintSection> {
  const canvas = getCanvas2d();
  const ctx = canvas.getContext('2d');

  let canvasHash = EMPTY;
  let payloadLength = 0;
  if (ctx) {
    drawCanvasProbe(ctx);
    const dataUrl = canvas.toDataURL();
    payloadLength = dataUrl.length;
    canvasHash = fnv1aHex(dataUrl);
  }

  const audio = await probeAudio();
  components.canvasHash = canvasHash;
  components.audioHash = audio.hash;

  return {
    id: 'canvas-audio',
    title: 'Canvas & audio',
    status: canvasHash === EMPTY || audio.hash === EMPTY ? 'partial' : 'ok',
    hint: 'Same drawing and same oscillator render differently across GPU, driver and audio stack — these hashes are the classic "canvas fingerprint".',
    items: [
      { label: 'canvas 2d hash', value: canvasHash },
      { label: 'canvas payload', value: payloadLength ? `${payloadLength} chars` : EMPTY },
      { label: 'audio hash', value: audio.hash },
      { label: 'sample rate', value: audio.sampleRate ? `${audio.sampleRate} Hz` : EMPTY },
      { label: 'channels', value: audio.channels ? String(audio.channels) : EMPTY },
    ],
    note: 'Emoji rendering, font smoothing and audio resampling differ per platform — the same browser on another OS lands on a different hash.',
  };
}

function collectFonts(components: Components): FingerprintSection {
  const ctx = getCanvas2d().getContext('2d');
  if (!ctx) {
    return {
      id: 'fonts',
      title: 'Fonts',
      status: 'unavailable',
      items: [{ label: 'canvas 2d context', value: EMPTY }],
    };
  }

  const installed = detectFonts(ctx);
  components.fonts = [...installed].sort().join(',');

  return {
    id: 'fonts',
    title: 'Fonts',
    status: 'ok',
    hint: 'Width of a fixed string in a candidate font is compared against the fallback fonts — no font may be rendered or loaded.',
    items: [
      { label: 'installed', value: `${installed.length} of ${TEST_FONTS.length}` },
      { label: 'list hash', value: fnv1aHex([...installed].sort().join(',')) },
    ],
    chips: [
      { label: 'detected', items: installed.length ? [...installed].sort() : [EMPTY] },
    ],
    note: 'Depends on the installed font pack, not on the browser: another distro or an OS update changes this list.',
  };
}

async function collectMedia(components: Components): Promise<FingerprintSection> {
  const nav = getNavigator();
  let deviceItems: FingerprintItem[] = [{ label: 'device enumeration', value: NOT_FROM_JS }];
  let status: FingerprintStatus = 'partial';

  try {
    const devices = await nav.mediaDevices?.enumerateDevices?.();
    if (devices) {
      const count = (kind: string) => devices.filter((device) => device.kind === kind).length;
      const labelled = devices.filter((device) => device.label).length;
      deviceItems = [
        { label: 'audio inputs', value: String(count('audioinput')) },
        { label: 'video inputs', value: String(count('videoinput')) },
        { label: 'audio outputs', value: String(count('audiooutput')) },
        { label: 'labels visible', value: `${labelled} of ${devices.length}` },
      ];
      status = 'ok';
    }
  } catch {
    status = 'partial';
  }

  const video = document.createElement('video');
  const audio = document.createElement('audio');
  const codecItems = CODEC_TESTS.map((test) => {
    const element = test.kind === 'video' ? video : audio;
    return { label: test.label, value: element.canPlayType(test.type) || 'no' };
  });
  components.codecs = codecItems.map((item) => `${item.label}:${item.value}`).join(',');

  return {
    id: 'media',
    title: 'Media',
    status,
    hint: 'Device labels need a permission grant; codec support is decided by the platform, not by the browser build alone.',
    items: [
      ...deviceItems,
      ...codecItems,
    ],
    note: 'Counts and codec answers move with plugged-in cameras and OS media packs.',
  };
}

async function collectRuntime(): Promise<FingerprintSection> {
  const nav = getNavigator();
  const performanceWithMemory = performance as Performance & { memory?: MemoryInfo };

  const battery = await withTimeout(nav.getBattery?.(), 600);
  let gamepads = EMPTY;
  try {
    gamepads = text(nav.getGamepads?.().filter(Boolean).length);
  } catch {
    gamepads = EMPTY;
  }

  return {
    id: 'runtime',
    title: 'Runtime & hardware',
    status: 'partial',
    items: [
      {
        label: 'js heap',
        value: performanceWithMemory.memory
          ? `${formatBytes(performanceWithMemory.memory.usedJSHeapSize)} / ${formatBytes(performanceWithMemory.memory.jsHeapSizeLimit)}`
          : NOT_FROM_JS,
      },
      {
        label: 'battery',
        value: battery ? `${Math.round(battery.level * 100)}%${battery.charging ? ', charging' : ''}` : NOT_FROM_JS,
      },
      { label: 'gamepads connected', value: gamepads },
      {
        label: 'speech voices',
        value: text(window.speechSynthesis?.getVoices?.().length),
      },
      { label: 'webassembly', value: typeof WebAssembly === 'undefined' ? EMPTY : 'supported' },
      {
        label: 'shared array buffer',
        value: typeof SharedArrayBuffer === 'undefined' ? EMPTY : 'available',
      },
    ],
    note: 'Volatile: heap size, battery and voices change during a session, so they are excluded from the composite hash.',
  };
}

function collectServerSide(): FingerprintSection {
  return {
    id: 'server-side',
    title: 'Server side only',
    status: 'unavailable',
    hint: 'Everything from the example payload that JavaScript can never see — it is read by the server from the TLS ClientHello, HTTP/2 SETTINGS and IP/TCP headers.',
    items: [
      { label: 'ip:port', value: SERVER_ONLY },
      { label: 'tls cipher suites', value: SERVER_ONLY },
      { label: 'tls extensions', value: SERVER_ONLY },
      { label: 'ja3 / ja4', value: SERVER_ONLY },
      { label: 'client random / session id', value: SERVER_ONLY },
      { label: 'http/2 frames (akamai fp)', value: SERVER_ONLY },
      { label: 'tcp ttl / window / options (p0f)', value: SERVER_ONLY },
    ],
    note: 'Point the same browser at a TLS dump endpoint (tls.peet.ws, browserleaks.com/tls) to see this half of the fingerprint.',
  };
}

async function collectFingerprint(): Promise<{ sections: FingerprintSection[]; hash: string }> {
  const components: Components = {};
  const sections: FingerprintSection[] = [
    collectHttp(),
    collectNetwork(),
    collectUserAgent(components),
    await collectSystem(components),
    collectDisplay(components),
    collectGraphics(components),
    await collectCanvasAudio(components),
    collectFonts(components),
    await collectMedia(components),
    await collectRuntime(),
    collectServerSide(),
  ];
  return { sections, hash: hashComponents(components) };
}

export function useFingerprint() {
  const sections = ref<FingerprintSection[]>([]);
  const hash = ref(EMPTY);
  const state = ref<FingerprintState>('idle');
  const error = ref<string | null>(null);
  const collectedAt = ref<string | null>(null);

  const json = computed(() =>
    JSON.stringify(
      {
        hash: hash.value,
        collected_at: collectedAt.value,
        sections: sections.value.map((section) => ({
          id: section.id,
          status: section.status,
          items: section.items,
          chips: section.chips,
        })),
      },
      null,
      2,
    ),
  );

  async function refresh() {
    if (!import.meta.client) return;
    state.value = 'collecting';
    error.value = null;
    try {
      const collected = await collectFingerprint();
      sections.value = collected.sections;
      hash.value = collected.hash;
      collectedAt.value = new Date().toISOString();
      state.value = 'ready';
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : String(cause);
      state.value = 'error';
    }
  }

  onMounted(refresh);

  return { sections, hash, state, error, collectedAt, json, refresh };
}
