<script setup lang="ts">
import LoadingSpinner from '@/components/loading-spinner.vue';
import { computed, onMounted, ref } from 'vue';
import { useApiClient } from '@/composables/api-client/use-api-client';
const isLoading = ref(false);
const apiClient = useApiClient();
const playlists = ref([] as any[]);
const selectedPlaylistId = ref(undefined as any);
const selectedTrack = ref(undefined as string | undefined);

onMounted(async () => {
  await loadPlaylists();
});

const isSelectedPlaylistRestricted = computed((): boolean => {
  if (!selectedPlaylistId.value) {
    return false;
  }
  return playlists.value.filter((p) => {
    return p.id === selectedPlaylistId.value;
  })[0].isRestricted;
});
async function loadPlaylists() {
  let result: any;
  isLoading.value = true;
  try {
    result = await apiClient.get('/internal/playlists/all');
    playlists.value = result.data;
    selectedPlaylistId.value = '';
  } catch (e) {
    apiClient.displayGenericError(e, 'Failed to load playlists');
  } finally {
    isLoading.value = false;
  }
}
async function handleSubmit() {
  let result: any;
  try {
    result = await apiClient.post('/internal/playlists/add-song', {
      trackId: selectedTrack.value,
      playlistId: selectedPlaylistId.value,
    });
  } catch (e: any) {
    apiClient.displayGenericError(e, 'Song could not be added');
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div v-if="isLoading" class="text-center mt-5">
    <loading-spinner></loading-spinner>
  </div>
  <div v-else class="row justify-content-center">
    <div class="col-12 col-lg-6">
      <h4>Submit a song</h4>
      <form class="mt-4" @submit.prevent="handleSubmit">
        <div>
          <label for="playlist-select" class="form-label">Playlist</label>
          <select
            class="form-select"
            id="playlist-select"
            v-model="selectedPlaylistId"
            :class="[!selectedPlaylistId ? 'text-muted' : '']"
            required
          >
            <option value="" disabled>Select a playlist</option>
            <option
              v-for="playlist in playlists"
              v-bind:key="playlist.id"
              :value="playlist.id"
              class="text-dark"
            >
              {{ playlist.name }}
            </option>
          </select>
          <div
            class="alert alert-info mt-3"
            v-if="isSelectedPlaylistRestricted"
          >
            Selected playlist is restricted to artists with fewer than 1,000
            followers
          </div>
        </div>
        <div class="mt-3">
          <label for="track-id-input" class="form-label">Spotify track</label>
          <div class="input-group">
            <span class="input-group-text" id="track-id-addon"
              >open.spotify.com/track/</span
            >
            <input
              type="text"
              class="form-control"
              id="track-id-input"
              aria-describedby="track-id-addon"
              placeholder="spotify-track-id"
              required
              v-model="selectedTrack"
            />
          </div>
          <div class="mt-3 text-end">
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
