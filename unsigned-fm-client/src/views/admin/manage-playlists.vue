<script setup lang="ts">
import LoadingSpinner from '@/components/loading-spinner.vue';
import { onMounted, ref } from 'vue';
import { useApiClient } from '@/composables/api-client/use-api-client';
import { required, email } from '@vuelidate/validators';

const apiClient = useApiClient();
const isLoading = ref(true);
const playlists = ref(null as any);
const newPlaylist = ref({
  spotifyPlaylistId: '',
  isRestricted: false,
});
const newPlaylistValidation = {
  spotifyPlaylistId: { required },
};
onMounted(async () => {
  await loadPlaylists();
});

async function loadPlaylists() {
  isLoading.value = true;
  let result = null as any;
  try {
    result = await apiClient.get('/internal/playlists/all');
  } catch (e) {
    apiClient.handleGenericError(e, 'Failed to load playlists');
  }
  playlists.value = result.data;
  isLoading.value = false;
}

async function addPlaylist() {
  isLoading.value = true;
  try {
    await apiClient.post('/internal/playlists/save', newPlaylist.value);
  } catch (e) {
    apiClient.handleGenericError(e, 'Failed to load playlists');
  }
  await loadPlaylists();
  isLoading.value = false;
}
</script>

<template>
  <div class="col-12">
    <h4><router-link to="/admin/home">Admin</router-link></h4>
    <div class="mt-3">
      <h5>Playlists</h5>
      <div v-if="isLoading" class="text-center">
        <loading-spinner></loading-spinner>
      </div>
      <div v-else-if="playlists" class="justify-content-center">
        <div class="row">
          <div class="col-12 col-lg-6">
            <div class="card mb-3">
              <div class="card-header">Add Playlist</div>
              <div class="card-body">
                <div>
                  <label for="new-playlist-spotify-id" class="form-label"
                    >Spotify Playlist ID</label
                  >
                  <input class="form-control" id="new-playlist-spotify-id" />
                </div>
                <div>
                  <label for="new-playlist-is-restricted" class="form-label"
                    >Is Restricted</label
                  >
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="new-playlist-is-restricted"
                    />
                  </div>
                </div>
                <div>
                  <button class="btn btn-primary" @click="addPlaylist()">
                    Add Playlist
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-6">
            <div class="card">
              <div class="card-header">Edit Playlists</div>
              <div class="card-body">
                <ul class="list-group">
                  <li
                    class="list-group-item"
                    v-for="playlist of playlists"
                    v-bind:key="playlist.id"
                  >
                    <input
                      class="form-control"
                      placeholder="Name"
                      v-model="playlist.name"
                    />
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="new-playlist-is-restricted"
                      v-model="playlist.isRestricted"
                    />
                    <label
                      class="form-check-label"
                      for="new-playlist-is-restricted"
                      >Is restricted?</label
                    >
                  </li>
                </ul>
                <div>
                  <button
                    class="btn btn-primary btn-sm"
                    v-if="playlists && playlists?.length >= 1"
                  >
                    Save
                  </button>
                  <p><em>No playlists</em></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
