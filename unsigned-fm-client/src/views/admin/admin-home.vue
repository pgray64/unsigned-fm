<script setup lang="ts">
import { onMounted, ref } from 'vue';
import LoadingSpinner from '@/components/loading-spinner.vue';
import { useApiClient } from '@/composables/api-client/use-api-client';

const isLoadingUser = ref(false);
const user = ref(null as any);

const apiClient = useApiClient();

onMounted(async function () {
  await getCurrentUser();
});
async function getCurrentUser(): Promise<any> {
  isLoadingUser.value = true;
  let result = null as any;
  try {
    result = await apiClient.get('/internal/admin/spotify/user-info');
  } catch (e) {
    apiClient.handleGenericError(
      e,
      'Failed to load API user profile, access token may not be configured',
    );
  }
  user.value = result.data;
  isLoadingUser.value = false;
}
async function authorizeWithSpotify() {
  let result = null as any;
  try {
    result = await apiClient.get('/internal/admin/spotify/authorization-url');
  } catch (e) {
    apiClient.handleGenericError(e, 'Failed to get Spotify auth link');
  }
  const url = result.data.url;
  window.location.href = url;
}
</script>

<template>
  <div class="col-12 col-lg-6">
    <h4>Admin</h4>
    <div>
      <button class="btn btn-primary me-2" @click="getCurrentUser">
        Verify Spotify Token
      </button>
      <button class="btn btn-secondary" @click="authorizeWithSpotify">
        Authorize with Spotify
      </button>
    </div>
    <div class="mt-5">
      <div v-if="isLoadingUser" class="text-center">
        <loading-spinner></loading-spinner>
      </div>
      <div v-else-if="user" class="row justify-content-center">
        <h5>Spotify API User</h5>
        <ul class="list-group">
          <li class="list-group-item">
            <div class="fw-bold small">Username</div>
            <div>{{ user.displayName }}</div>
          </li>
          <li class="list-group-item">
            <div class="fw-bold small">Email</div>
            <div>{{ user.email }}</div>
          </li>
          <li class="list-group-item">
            <div class="fw-bold small">Profile</div>
            <div>
              <a :href="user.spotifyUrl">{{ user.spotifyUrl }}</a>
            </div>
          </li>
          <li class="list-group-item" v-if="user.imageUrl">
            <img :src="user.imageUrl" height="200" width="200" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
