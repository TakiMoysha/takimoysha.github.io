<script setup lang="ts">
import ToolThemeSwitcher from '@/components/ToolThemeSwitcher.vue';
import CardInfo from '@/components/draft/CardInfo.vue';

interface Props {
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Blank Page',
});
useHead({ title: props.title });

const properties = [
  {
    title: 'Robust',
    description:
      'Po, the day you were chosen as Dragon Warrior was the worst day of my life. By far. Nothing else came close.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>`,
  },
  {
    title: 'Efficient',
    description: "Honestly, I didn't really know what I was doing.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>`,
  },
  {
    title: 'Intuitive',
    description: "Your enemy can't guess your strategy if you don't have any.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>`,
  },
];

const testimonials = [
  {
    username: 'Sun Tzu',
    role: 'Leader',
    avatar_url:
      'https://testingbot.com/free-online-tools/random-avatar/200?u=u837kfei139kn',
    text: 'If you know the enemy and know yourself, you need not fear the result of a hundred battles. If you know yourself but not the enemy, for every victory gained you will also suffer a defeat. If you know neither the enemy nor yourself, you will succumb in every battle.',
  },
  {
    username: 'Oogway',
    role: 'Master',
    avatar_url:
      'https://testingbot.com/free-online-tools/random-avatar/200?u=u837kxei139kn',
    text: 'Oh, Shifu. THere is just news. There is no good or bad.',
  },
  {
    username: 'Mao Zedong',
    role: 'Leader',
    avatar_url:
      'https://testingbot.com/free-online-tools/random-avatar/200?u=u8wdf7ei139kn',
    text: 'I thought I wanted a career, turns out I just wanted a paycheck.',
  },
  {
    username: 'Winston Churchill',
    role: 'General',
    avatar_url:
      'https://testingbot.com/free-online-tools/random-avatar/200?u=u8o1iwqq139kx',
    text: 'und eri doderido deriodod eriodoo Iwbnfouevcmsiehwvudbqv Government.',
  },
  {
    username: 'Niccolò di Bernardo dei Machiavelli',
    role: 'Leader',
    avatar_url:
      'https://testingbot.com/free-online-tools/random-avatar/200?u=u837kfei139kx',
    text: 'I am not a philosopher because I have read too much, I am a philosopher because I have read too little.',
  },
];

import { useLocaleFromQuery } from '@/composables/useQuery';

const locale = useLocaleFromQuery();
</script>

<template>
  <Html lang="en" dir="ltr" />

  <Head>
    <Meta charset="UTF-8" />
    <Meta name="viewport" content="width=device-width, initial-scale=1" />
    <Meta name="robots" content="index, follow" />
    <Link rel="icon" type="image/svg+xml" href="/favicon.png" />
  </Head>

  <div class="flex min-h-screen flex-col bg-base">
    <header class="shadow-sm">
      <div class="flex items-center justify-around justify-items-center max-w-6xl mx-auto p-4">
        <div>
          <NuxtLink to="/" class="text-2xl">
            <h1 class="uppercase font-bold bg-linear-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent">
              Blank Layout
            </h1>
          </NuxtLink>
        </div>

        <nav class="hidden md:flex space-x-6">
          <a href="/" class="prose-headings text-onlight-text hover:text-accent transition">Home</a>
          <a href="#" class="hover:line-through transition">Projects</a>
          <a href="#" class="hover:line-through transition">Links</a>
          <a href="#" class="hover:line-through transition">About</a>
        </nav>

        <div class="flex">
          <ToolThemeSwitcher />
        </div>
      </div>
    </header>

    <main id="main-content">
      <!-- hero section -->
      <section>
        <div class="py-8 bg-linear-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
          <div class="px-6 text-center">
            <h2 class="text-4xl md:text-6xl font-bold text-primary-content mb-6">
              Welcome to
              <span class="font-mono text-amber-400">Blank Layout</span>
            </h2>
            <p class="text-lg md:text-xl text-primary-content mb-8">
              Simple landing for see, how it look.
            </p>
            <p>
              <span class="border border-debug text-lg md:text-xl text-debug-content mb-8">Debug content Text.</span>
            </p>
          </div>
        </div>
      </section>

      <!-- grid section -->
      <section class="max-auto py-16 mx-auto max-w-6xl">
        <div class="container mx-auto px-6">
          <h3 class="text-3xl font-bold text-center text-headings mb-12">
            Some Wisdom
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CardInfo v-for="(item, index) in properties" :key="index" :title="item.title"
              :description="item.description" :icon="item.icon" />
          </div>
        </div>
      </section>
      <!-- palette -->
      <section class="flex flex-col bg-background mx-auto max-w-6xl p-6">
        <h4 class="mt-4 text-2xl">Base</h4>
        <div class="palette-block text-primary-content bg-primary">
          text-primary-content + bg-primary
        </div>
        <div class="palette-block text-secondary-content bg-secondary">
          text-secondary-content + bg-secondary
        </div>
        <div class="palette-block text-accent-content bg-accent">
          text-accent-content + bg-accent
        </div>
        <div class="palette-block text-neutral-content bg-neutral">
          text-neutral-content + bg-neutral
        </div>

        <h4 class="mt-4 text-2xl">Signals</h4>
        <div class="palette-block bg-info text-info-content">
          text-info-content + bg-info
        </div>
        <div class="palette-block bg-success text-success-content">
          text-success-content + bg-success
        </div>
        <div class="palette-block bg-warning text-warning-content">
          text-warning-content + bg-warning
        </div>
        <div class="palette-block bg-error text-error-content">
          text-error-content + bg-error
        </div>

        <h4 class="mt-4 text-2xl">Background & Surface</h4>
        <div class="palette-block text-base-content bg-base-100">
          text-base-content + bg-base-100
        </div>
        <div class="palette-block text-base-content bg-base-200">
          text-base-content + bg-base-200
        </div>
        <div class="palette-block text-base-content bg-base-300">
          text-base-content + bg-base-300
        </div>
        <div class="palette-block text-base-content bg-base-400">
          text-base-content + bg-base-400
        </div>


        <h4 class="mt-4 text-2xl">Fonts & Sizes</h4>
        <div class="palette-block text-base-content font-sans">Font Sans <span class="uppercase">UppserCase</span></div>
        <div class="palette-block text-base-content font-mono">Font Mono <span class="uppercase">UppserCase</span></div>
        <div class="palette-block text-base-content font-digital">Font Digital <span class="uppercase">UppserCase</span>
        </div>
      </section>

      <!-- testimonials -->
      <section class="relative isolate overflow-hidden bg-base-200 px-6 py-24 sm:py-32 lg:px-8">
        <div
          class="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-primary),transparent)] opacity-10">
        </div>
        <div
          class="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gray-900 dark:bg-slate-400 shadow-xl ring-1 shadow-indigo-500/5 ring-white/5 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center">
        </div>

        <div class="container mx-auto max-w-6xl px-6">
          <h2 class="text-3xl md:text-4xl font-bold text-center text-shadow-lg mb-12 text-primary-content">
            Testimonials
          </h2>
          <div>
            <p>
              Locale: {{ locale }}
            </p>
            <p>Locale: {{ useRoute().query.locale || useAppConfig().defaultLocale }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.palette-block {
  @apply px-4 py-2 my-2 text-center border border-emerald-700/20;
}
</style>
