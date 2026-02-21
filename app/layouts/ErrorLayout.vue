<script setup lang="ts">
import { SITE } from '@/constants';
import BaseLayout from '@/layouts/BaseLayout.vue';

type ErrorCode = '404' | '500' | 'work-in-progress';

interface Props {
  code: ErrorCode;
}

const props = withDefaults(defineProps<Props>(), {
  code: '500',
});

interface ErrorInfo {
  text: string;
  description: string;
}

const ERROR_MAP: Record<ErrorCode, ErrorInfo> = {
  '404': {
    text: '404 Not Found',
    description: 'Page not found, check the URL.',
  },
  '500': {
    text: '500 Internal Server Error',
    description: 'Something went wrong on our end.',
  },
  'work-in-progress': {
    text: 'Work In Progress',
    description: 'This page is under development.',
  },
};

const DEFAULT_ERROR: ErrorInfo = {
  text: 'Unexpected Error',
  description: "I don't know what happens ¯\\_(ツ)_/¯",
};

const route = useRoute();

const currentPath = computed(() => route.path);

const error = computed<ErrorInfo>(() => {
  return ERROR_MAP[props.code] ?? DEFAULT_ERROR;
});

const pageTitle = computed(() => `${error.value.text} | ${SITE.title}`);
</script>

<template>
  <BaseLayout :title="pageTitle" :description="error.description">
    <div class="flex items-center justify-center p-4 mx-auto">
      <div class="glitch-container relative p-4">
        <h1 class="shake-box glitch text-shadow-md text-center text-6xl font-bold font-digital" :data-text="error.text">
          {{ error.text }}
        </h1>
        <p class="text-shadow-md mb-8 text-center text-xl font-digital text-neutral-content md:text-2xl">
          {{ error.description }}
        </p>

        <div class="relative overflow-hidden rounded-lg border border-gray-800 bg-gray-900 p-4">
          <div class="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent" />
          <code class="relative z-10 block overflow-x-auto font-digital text-sm text-green-400">
            <span class="text-purple-400">if</span> (<span class="text-blue-400">!</span><span
              class="text-white">router</span>.<span class="text-yellow-400">get</span><span class="text-green-200">('{{
              currentPath }}'</span>)) {<br />
            &nbsp;&nbsp;<span class="text-red-400">console</span>.<span class="text-yellow-400">error</span>(<span
              class="text-green-200">'{{ error.text }}'</span>);<br />
            &nbsp;&nbsp;<span class="text-purple-400">throw new </span><span class="text-blue-400">Error</span>(<span
              class="text-green-200">'The page you are looking for does not exist'</span>);<br />
            }
          </code>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<style scoped>
.glitch-container {
  position: relative;
  max-width: 100%;
}

.glitch-container::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 255, 255, 0.1) 50%);
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 10;
}

.shake-box {
  animation: noise 0.2s linear infinite;
}

.glitch {
  position: relative;
  color: #fff;
  letter-spacing: 0.5px;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
}

.glitch::before {
  left: 2px;
  text-shadow: -2px 0 #ff00ff;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-1 5s infinite ease-in-out;
}

.glitch::after {
  left: -2px;
  text-shadow: 2px 0 #00ffff;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-2 5s infinite linear alternate-reverse;
}

@keyframes noise {

  0%,
  100% {
    transform: translate(0, 0);
  }

  25% {
    transform: translate(-1px, 1px);
  }

  50% {
    transform: translate(1px, -1px);
  }

  75% {
    transform: translate(-1px, -1px);
  }
}

@keyframes glitch-1 {
  0% {
    clip: rect(31px, 9999px, 94px, 0);
  }

  10% {
    clip: rect(112px, 9999px, 76px, 0);
  }

  20% {
    clip: rect(85px, 9999px, 77px, 0);
  }

  30% {
    clip: rect(27px, 9999px, 97px, 0);
  }

  40% {
    clip: rect(64px, 9999px, 98px, 0);
  }

  50% {
    clip: rect(90px, 9999px, 91px, 0);
  }

  60% {
    clip: rect(111px, 9999px, 114px, 0);
  }

  70% {
    clip: rect(23px, 9999px, 92px, 0);
  }

  80% {
    clip: rect(64px, 9999px, 98px, 0);
  }

  90% {
    clip: rect(40px, 9999px, 73px, 0);
  }

  100% {
    clip: rect(62px, 9999px, 93px, 0);
  }
}

@keyframes glitch-2 {
  0% {
    clip: rect(65px, 9999px, 119px, 0);
  }

  10% {
    clip: rect(52px, 9999px, 74px, 0);
  }

  20% {
    clip: rect(86px, 9999px, 85px, 0);
  }

  30% {
    clip: rect(95px, 9999px, 91px, 0);
  }

  40% {
    clip: rect(120px, 9999px, 74px, 0);
  }

  50% {
    clip: rect(71px, 9999px, 103px, 0);
  }

  60% {
    clip: rect(84px, 9999px, 67px, 0);
  }

  70% {
    clip: rect(60px, 9999px, 99px, 0);
  }

  80% {
    clip: rect(98px, 9999px, 114px, 0);
  }

  90% {
    clip: rect(46px, 9999px, 65px, 0);
  }

  100% {
    clip: rect(30px, 9999px, 92px, 0);
  }
}
</style>
