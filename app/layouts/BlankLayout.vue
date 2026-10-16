<script setup lang="ts">
import ToolThemeSwitcher from "@/components/ToolThemeSwitcher.vue";

interface Props {
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Blank Page",
});
useHead({ title: props.title });
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
            <h1
              class="uppercase font-bold bg-linear-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent"
            >
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
      <slot />
    </main>
  </div>
</template>
