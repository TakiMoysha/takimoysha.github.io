<script setup lang="ts">
import BlankLayout from "@/layouts/BlankLayout.vue";
import MyFingerprint from "~/components/draft/MyFingerprint.vue";
</script>

<template>
  <div>
    <BlankLayout />
    <MyFingerprint />

    <div class="mt-6 mb-10 flex justify-center">
      <BadgeButton src="/badge-mr.robot.gif" alt="MR. Robot" title="fsociety" />
    </div>
  </div>
</template>
