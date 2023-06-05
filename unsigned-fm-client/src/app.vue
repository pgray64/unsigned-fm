<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNavBar from "@/components/top-nav-bar.vue";
import {ref} from "vue";
import {useSession} from "@/stores/session";

const loading = ref(true);
// Vue3 composition - directly in here is equivalent to created hook
initialize();

async function initialize() {
  const session = useSession();
  await session.loadCsrfToken();
  await session.loadSession();
  loading.value = false;
}

</script>

<template>
    <header class="border-bottom">
      <top-nav-bar/>
    </header>
    <main>
      <div class="container mt-5">
        <div v-if="loading" class="pt-5 d-flex justify-content-center">
          <div class="spinner-grow text-primary"></div>
        </div>
        <router-view v-else/>
      </div>
    </main>
</template>

<style scoped>
</style>
