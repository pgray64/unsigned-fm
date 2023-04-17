<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNav from '@/components/shared/top-nav.vue'
</script>

<template>
  <div class="container px-3 pb-3 md:px-2 mx-auto">
    <top-nav />
    <RouterView />
  </div>
</template>

<style scoped></style>
