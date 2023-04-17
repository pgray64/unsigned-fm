<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNav from '@/components/shared/top-nav.vue'
</script>

<template>
  <top-nav />
  <div class="container mx-auto">
    <RouterView />
  </div>
</template>

<style scoped></style>
