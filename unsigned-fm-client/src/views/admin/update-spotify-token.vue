<script setup lang="ts">
import { onMounted, ref } from 'vue';
import LoadingSpinner from '@/components/loading-spinner.vue';
import { useApiClient } from '@/composables/api-client/use-api-client';
import { useRoute } from 'vue-router';

const isLoading = ref(true);
const isSuccess = ref(false);
const apiClient = useApiClient();
const route = useRoute();

onMounted(async () => {
  await updateSpotifyTokenFromCode();
});

async function updateSpotifyTokenFromCode() {
  isLoading.value = true;
  try {
    const code = route.query.code;
    await apiClient.post('/internal/admin/spotify/update-access-token', {
      code,
    });
    isSuccess.value = true;
  } catch (e) {
    isSuccess.value = false;
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="row">
    <div class="col-12 col-lg-6">
      <h4><router-link to="/admin/home">Admin</router-link></h4>
      <div class="mt-4">
        <h5>Updating Spotify Token</h5>
        <div v-if="isLoading" class="text-center">
          <loading-spinner></loading-spinner>
        </div>

        <div class="alert alert-success" v-else-if="isSuccess">
          <i class="bi bi-check2-circle"></i> Successfully updated Spotify user
          access token
        </div>
        <div class="alert alert-danger" v-else>
          <i class="bi bi-x-circle"></i> Failed to update Spotify user access
          token
        </div>
        <div>
          <router-link to="/admin/home">Back to admin panel</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
