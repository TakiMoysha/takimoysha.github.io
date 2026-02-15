<template>
  <div class="dropdown">
    <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
      </svg>
    </div>
    <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box mt-3 w-52 p-2 shadow-sm border-accent">
      <li><NuxtLink to="/archive">Archive</NuxtLink></li>
      <li><NuxtLink to="/cycles">Cycles</NuxtLink></li>
      <li><NuxtLink to="/projects">Projects</NuxtLink></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// ToolNavigator component - mobile navigation dropdown
</script>
