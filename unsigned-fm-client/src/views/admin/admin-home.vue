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
    apiClient.displayGenericError(
      e,
      'Failed to load API user profile, access token may not be configured',
    );
  } finally {
    isLoadingUser.value = false;
  }
  user.value = result.data;
}
async function authorizeWithSpotify() {
  let result = null as any;
  try {
    result = await apiClient.get('/internal/admin/spotify/authorization-url');
  } catch (e) {
    apiClient.displayGenericError(e, 'Failed to get Spotify auth link');
  }
  const url = result.data.url;
  window.location.href = url;
}
</script>

<template>
  <div class="row">
    <div class="col-12 col-lg-6">
      <h4>Admin</h4>
      <div class="mt-3">
        <router-link to="/admin/playlists/manage" class="me-2"
          >Playlists</router-link
        >
        <router-link to="/admin/users">Users</router-link>
      </div>
      <div class="mt-4">
        <h5>Spotify API User</h5>
        <div class="mt-4">
          <button class="btn btn-primary me-2 mb-2" @click="getCurrentUser">
            Verify Spotify Token
          </button>
          <button class="btn btn-secondary mb-2" @click="authorizeWithSpotify">
            Authorize with Spotify
          </button>
        </div>
        <div v-if="isLoadingUser" class="text-center">
          <loading-spinner></loading-spinner>
        </div>
        <div v-else-if="user" class="justify-content-center">
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
              <div class="text-truncate">
                <a :href="user.spotifyUrl">{{ user.spotifyUrl }}</a>
              </div>
            </li>
            <li class="list-group-item" v-if="user.imageUrl">
              <img :src="user.imageUrl" style="max-width: 150px" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
