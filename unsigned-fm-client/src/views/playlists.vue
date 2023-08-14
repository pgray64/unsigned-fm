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
      <div class="row mb-3">
        <div class="col-12">
          <div class="alert alert-success">
            <div class="alert-heading"><b>How does it work?</b></div>
            <div>
              <router-link to="/submit">Submit</router-link> your own songs or
              your favorite songs by new artists. The most popular submissions
              are used to automatically update our Spotify playlists!
            </div>
          </div>
        </div>
      </div>
      <h4>Playlists</h4>
      <div class="mt-4 row">
        <div
          class="col-12 col-lg-6 mb-3"
          v-for="playlist of playlists"
          v-bind:key="playlist.id"
        >
          <div class="card">
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
                        {{
                          (playlist.submissionCount as number).toLocaleString(
                            undefined,
                            {
                              notation: 'compact',
                              maximumFractionDigits: 1,
                            },
                          )
                        }}
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
                      :href="playlist.spotifyPlaylistUrl"
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
