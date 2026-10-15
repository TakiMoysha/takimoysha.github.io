<script setup lang="ts">
import { ref } from 'vue';
import { useFingerprint } from '@/composables/useFingerprint';
import {
  isUnavailableValue,
  type FingerprintStatus,
} from '@/utils/fingerprint';

/**
 * Client-side fingerprint widget for the fingerprint article.
 *
 * Mirrors the shape of a server-side dump (tls.peet.ws/api/all style payload),
 * but fills it with signals JavaScript can actually read. Everything that needs
 * a TLS/TCP termination point (ip, ja3/ja4, http2 frames, tcp options) is shown
 * as "server side only" instead of being guessed.
 *
 * No network requests: collection happens locally on mount.
 */

type View = 'summary' | 'json';

const view = ref<View>('summary');
const copied = ref(false);

const { sections, hash, state, error, collectedAt, json, refresh } = useFingerprint();

const badgeClass: Record<FingerprintStatus, string> = {
  ok: 'border-success/40 bg-success/15 text-success',
  partial: 'border-warning/40 bg-warning/15 text-warning',
  unavailable: 'border-base-300 bg-base-300/60 text-base-content/60',
};

const buttonClass =
  'rounded-md border border-base-300 bg-base-100 px-3 py-1.5 text-sm text-base-content transition hover:border-accent hover:text-accent disabled:opacity-50';

async function copyJson() {
  try {
    await navigator.clipboard.writeText(json.value);
    copied.value = true;
    window.setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    copied.value = false;
  }
}
</script>

<template>
  <section
    class="not-prose w-full overflow-hidden rounded-xl border border-base-300 bg-base-100 text-left shadow-sm">
    <header
      class="flex flex-wrap items-start justify-between gap-4 border-b border-base-300 px-5 py-4">
      <div>
        <h3 class="text-lg font-semibold text-base-content">My fingerprint</h3>
        <p class="mt-1 text-sm text-base-content/70">
          Everything below is read locally in your browser — no request leaves this page.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          :class="buttonClass"
          :disabled="state === 'collecting'"
          @click="refresh()">
          {{ state === 'collecting' ? 'Collecting…' : 'Re-collect' }}
        </button>
        <button
          type="button"
          :class="buttonClass"
          @click="view = view === 'json' ? 'summary' : 'json'">
          {{ view === 'json' ? 'Summary' : 'Raw JSON' }}
        </button>
        <button v-if="view === 'json'" type="button" :class="buttonClass" @click="copyJson()">
          {{ copied ? 'Copied' : 'Copy' }}
        </button>
      </div>
    </header>

    <div
      aria-live="polite"
      class="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 bg-base-200/60 px-5 py-3">
      <div class="min-w-0">
        <div class="text-[11px] uppercase tracking-wide text-base-content/50">
          composite hash (fnv-1a)
        </div>
        <code class="block break-all font-mono text-sm text-accent">{{ hash }}</code>
      </div>
      <div class="text-right text-xs text-base-content/60">
        <div>
          status:
          <span class="text-base-content">{{ state }}</span>
        </div>
        <time v-if="collectedAt" :datetime="collectedAt">{{ collectedAt }}</time>
      </div>
    </div>

    <div v-if="state === 'idle' || state === 'collecting'" class="space-y-3 px-5 py-6">
      <p class="text-sm text-base-content/60">Reading browser signals…</p>
      <div class="h-3 w-2/3 animate-pulse rounded bg-base-300"></div>
      <div class="h-3 w-1/2 animate-pulse rounded bg-base-300"></div>
      <div class="h-3 w-3/5 animate-pulse rounded bg-base-300"></div>
    </div>

    <div v-else-if="state === 'error'" class="px-5 py-6">
      <p class="text-sm text-error">Collection failed: {{ error }}</p>
    </div>

    <template v-else>
      <pre
        v-if="view === 'json'"
        class="max-h-[32rem] overflow-auto px-5 py-4 font-mono text-xs leading-relaxed text-base-content/90">{{ json }}</pre>

      <div v-else class="grid gap-4 px-5 py-5 sm:grid-cols-2">
        <article
          v-for="section in sections"
          :key="section.id"
          class="overflow-hidden rounded-lg border border-base-300 bg-base-200/40">
          <header
            class="flex items-center justify-between gap-2 border-b border-base-300 px-4 py-2">
            <h4 class="font-medium text-base-content">{{ section.title }}</h4>
            <span
              class="rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wide"
              :class="badgeClass[section.status]">
              {{ section.status }}
            </span>
          </header>

          <div class="px-4 py-3">
            <p v-if="section.hint" class="mb-3 text-xs leading-relaxed text-base-content/60">
              {{ section.hint }}
            </p>

            <dl class="space-y-1.5">
              <div
                v-for="item in section.items"
                :key="item.label"
                class="grid gap-x-3 text-sm sm:grid-cols-[9rem_minmax(0,1fr)]">
                <dt class="text-base-content/60">{{ item.label }}</dt>
                <dd
                  class="min-w-0 font-mono text-[13px] break-all"
                  :class="isUnavailableValue(item.value) ? 'text-base-content/40' : 'text-base-content'">
                  {{ item.value }}
                </dd>
              </div>
            </dl>

            <div v-for="group in section.chips" :key="group.label" class="mt-3">
              <div class="mb-1.5 text-[11px] uppercase tracking-wide text-base-content/50">
                {{ group.label }}
              </div>
              <ul class="flex flex-wrap gap-1.5">
                <li
                  v-for="chip in group.items"
                  :key="chip"
                  class="rounded border border-base-300 bg-base-100 px-1.5 py-0.5 font-mono text-[11px] break-all text-base-content/80">
                  {{ chip }}
                </li>
              </ul>
            </div>

            <p
              v-if="section.note"
              class="mt-3 border-t border-base-300/70 pt-2 text-xs leading-relaxed text-base-content/50">
              {{ section.note }}
            </p>
          </div>
        </article>
      </div>
    </template>

    <footer class="border-t border-base-300 px-5 py-3 text-xs text-base-content/50">
      The composite hash covers stable signals only (UA, languages, timezone, screen, GPU, canvas,
      audio, fonts). Volatile values — heap, battery, storage — are displayed but excluded, or the
      hash would change on every visit.
    </footer>
  </section>
</template>
