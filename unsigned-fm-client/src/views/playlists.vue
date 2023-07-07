<script setup lang="ts">
import LoadingSpinner from '@/components/loading-spinner.vue';
import { onMounted, ref } from 'vue';
import { useApiClient } from '@/composables/api-client/use-api-client';
import ImageThumbnail from '@/components/image-thumbnail.vue';

const isLoading = ref(false);
const apiClient = useApiClient();
const playlists = ref([] as any[]);

onMounted(async () => {
  await loadPlaylists();
});

async function loadPlaylists() {
  let result: any;
  isLoading.value = true;
  try {
    result = await apiClient.get('/internal/playlists/all');
    playlists.value = result.data;
  } catch (e) {
    apiClient.displayGenericError(e, 'Failed to load playlists');
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
      <h4>Playlists</h4>
      <div class="mt-4 row">
        <div
          class="col-12 col-lg-6 mb-3"
          v-for="playlist of playlists"
          v-bind:key="playlist.id"
        >
          <div class="card border-0 bg-light shadow-sm">
            <div class="card-body">
              <div class="card-text">
                <div class="d-flex">
                  <div>
                    <image-thumbnail
                      :image-url="playlist.playlistImageUrl"
                      :size-px="75"
                    ></image-thumbnail>
                  </div>
                  <div class="flex-grow-1 ps-2">
                    <div>
                      <div>
                        <router-link
                          class="text-decoration-none"
                          :to="`/playlist/${playlist.id}`"
                          ><b>{{ playlist.name }}</b></router-link
                        >
                      </div>
                      <div class="small">
                        {{ playlist.submissionCount.toLocaleString() }}
                        {{
                          playlist.submissionCount === 1
                            ? 'submission'
                            : 'submissions'
                        }}
                      </div>
                    </div>
                  </div>

                  <div>
                    <a
                      class="btn btn-outline-success btn-sm d-inline-block h-auto align-items-center"
                      :href="`https://open.spotify.com/playlist/${playlist.spotifyPlaylistId}`"
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
      </div>
    </div>
  </div>
</template>

<style scoped></style>
