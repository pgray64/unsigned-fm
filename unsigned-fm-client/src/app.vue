<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNavBar from "@/components/top-nav-bar.vue";
import {ref} from "vue";

const loading = ref(true);
// Vue3 composition - directly in here is equivalent to created hook
initialize();

async function initialize() {
  loading.value = false;
}

</script>

<template>
    <header class="border-bottom">
      <top-nav-bar/>
    </header>
    <main>
      <div class="container mt-5">
        <router-view/>
      </div>
    </main>
</template>

<style scoped>
</style>
