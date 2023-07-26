<script setup lang="ts">
import LoadingSpinner from '@/components/loading-spinner.vue';
import { onMounted, ref } from 'vue';
import { useApiClient } from '@/composables/api-client/use-api-client';
import ImageThumbnail from '@/components/image-thumbnail.vue';

const isLoading = ref(false);
const apiClient = useApiClient();
const songs = ref([] as any[]);

onMounted(async () => {
  await loadRecommendations();
});
function getArtistNames(artists: string[]) {
  return (artists ?? []).join(', ');
}
async function loadRecommendations() {
  let result: any;
  isLoading.value = true;
  try {
    result = await apiClient.get('/internal/playlists/song-recs');
    songs.value = result.data;
  } catch (e) {
    apiClient.displayGenericError(e, 'Failed to load songs');
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
    <div class="col-12">
      <h4>Recommended for you</h4>
      <div class="mt-4 row">
        <div
          class="col-12 col-lg-6 mb-3"
          v-for="song of songs"
          v-bind:key="song.id"
        >
          <div class="card flex-grow-1">
            <div class="card-body">
              <div class="card-text">
                <div class="d-flex">
                  <div>
                    <image-thumbnail
                      :image-url="song.albumImageUrl"
                      :size-px="75"
                    ></image-thumbnail>
                  </div>
                  <div class="flex-grow-1 ps-2">
                    <div>
                      <div>
                        <b>{{ song.name }}</b>
                      </div>
                      <div class="small">
                        {{ getArtistNames(song.artists) }}
                      </div>
                    </div>
                  </div>
                  <div class="d-flex flex-column align-items-start">
                    <a
                      class="btn btn-outline-success btn-sm d-inline-block h-auto align-items-center"
                      :href="song.spotifyTrackUrl"
                      target="_blank"
                    >
                      <span> <i class="bi bi-spotify"></i> Spotify </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="songs.length === 0" class="col-12 col-lg-6">
          <div class="alert alert-info">
            Vote for songs in
            <router-link to="/playlists">playlists</router-link> if you want to
            recommendations for songs you may enjoy!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
