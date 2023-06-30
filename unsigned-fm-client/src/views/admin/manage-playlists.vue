<script setup lang="ts">
import LoadingSpinner from '@/components/loading-spinner.vue';
import { computed, onMounted, ref } from 'vue';
import { useApiClient } from '@/composables/api-client/use-api-client';

const apiClient = useApiClient();
const isLoading = ref(true);
const playlists = ref(null as any);
const newPlaylist = ref({
  spotifyPlaylistId: '',
  isRestricted: false,
});
const newPlaylistValid = computed(() => {
  return newPlaylist.value.spotifyPlaylistId;
});
onMounted(async () => {
  await loadPlaylists();
});

async function loadPlaylists() {
  isLoading.value = true;
  let result = null as any;
  try {
    result = await apiClient.get('/internal/admin/playlists/all');
  } catch (e) {
    apiClient.displayGenericError(e, 'Failed to load playlists');
  }
  playlists.value = result.data;
  isLoading.value = false;
}

async function addPlaylist() {
  isLoading.value = true;
  try {
    await apiClient.post('/internal/admin/playlists/save', newPlaylist.value);
  } catch (e) {
    apiClient.displayGenericError(e, 'Failed to add playlist');
  } finally {
    isLoading.value = false;
  }
  newPlaylist.value = {
    spotifyPlaylistId: '',
    isRestricted: false,
  };
  await loadPlaylists();
}

async function updatePlaylist(playlist: any, isRestore: boolean) {
  isLoading.value = true;
  if (isRestore) {
    playlist.deletedAt = null;
  }
  try {
    await apiClient.post('/internal/admin/playlists/save', playlist);
  } catch (e) {
    apiClient.displayGenericError(e, 'Failed to update playlist');
  } finally {
    isLoading.value = false;
  }
  await loadPlaylists();
}
async function removePlaylist(playlistId: number) {
  isLoading.value = true;
  try {
    await apiClient.post('/internal/admin/playlists/remove', { playlistId });
  } catch (e) {
    apiClient.displayGenericError(e, 'Failed to remove playlist');
  } finally {
    isLoading.value = false;
  }
  await loadPlaylists();
}
</script>

<template>
  <div class="row">
    <div class="col-12">
      <h4><router-link to="/admin/home">Admin</router-link></h4>
      <div class="mt-4">
        <h5>Playlists</h5>
        <div v-if="isLoading" class="text-center mt-4">
          <loading-spinner></loading-spinner>
        </div>
        <div v-else-if="playlists" class="justify-content-center mt-4">
          <div class="row">
            <div class="col-12 col-lg-6">
              <div class="card mb-3">
                <div class="card-header">Add Playlist</div>
                <div class="card-body">
                  <div class="mb-2">
                    <label for="new-playlist-spotify-id" class="form-label"
                      >Spotify Playlist ID</label
                    >
                    <input
                      class="form-control"
                      id="new-playlist-spotify-id"
                      v-model="newPlaylist.spotifyPlaylistId"
                    />
                  </div>
                  <div>
                    <div class="form-check form-switch">
                      <input
                        v-model="newPlaylist.isRestricted"
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="new-playlist-is-restricted"
                      />
                      <label for="new-playlist-is-restricted" class="form-label"
                        >Is Restricted</label
                      >
                    </div>
                  </div>
                  <div>
                    <button
                      class="btn btn-primary"
                      @click="addPlaylist()"
                      :disabled="!newPlaylistValid"
                    >
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
                  <ul class="list-group" v-if="playlists.length > 0">
                    <li
                      class="list-group-item"
                      v-for="playlist of playlists"
                      v-bind:key="playlist.id"
                    >
                      <div class="mb-2">
                        <b> {{ playlist.name }}</b>

                        <span
                          v-if="playlist.deletedAt"
                          class="text-danger text-small ms-2"
                          ><i class="bi bi-eye-slash"></i> Hidden</span
                        >
                      </div>
                      <div class="form-check form-switch">
                        <input
                          v-model="playlist.isRestricted"
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          :id="`playlist-${playlist.id}-is-restricted`"
                        />
                        <label
                          for="`playlist-${playlist.id}-is-restricted`"
                          class="form-label"
                          >Is Restricted</label
                        >
                      </div>
                      <button
                        class="btn btn-sm btn-primary d-inline"
                        @click="updatePlaylist(playlist, false)"
                      >
                        <i class="bi bi-cloud-upload"></i>
                        Update
                      </button>
                      <button
                        v-if="playlist.deletedAt"
                        class="btn btn-sm d-inline ms-2 btn-outline-success"
                        @click="updatePlaylist(playlist, true)"
                      >
                        <i class="bi bi-arrow-counterclockwise"></i>
                        Restore
                      </button>
                      <button
                        v-else
                        class="btn btn-sm d-inline ms-2 btn-outline-danger"
                        @click="removePlaylist(playlist.id)"
                      >
                        <i class="bi bi-trash"></i>
                        Remove
                      </button>
                    </li>
                  </ul>
                  <p v-else><em>No playlists</em></p>
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
