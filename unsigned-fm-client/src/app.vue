<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNavBar from "@/components/top-nav-bar.vue";
</script>

<template>
    <header>
      <top-nav-bar/>
    </header>
    <main>
      <div class="container-fluid mt-3">
        <router-view />
      </div>
    </main>
</template>

<style scoped>
</style>
