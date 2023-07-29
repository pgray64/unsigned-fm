<script setup lang="ts">
import { RouterView } from 'vue-router';
import TopNavBar from '@/components/top-nav-bar.vue';
import BottomNavBar from '@/components/bottom-nav-bar.vue';
</script>

<template>
  <header class="border-bottom">
    <top-nav-bar />
  </header>
  <main>
    <div class="container mt-5">
      <router-view />
    </div>
  </main>
  <div style="min-height: 300px"></div>
  <bottom-nav-bar />
</template>
<style scoped></style>
