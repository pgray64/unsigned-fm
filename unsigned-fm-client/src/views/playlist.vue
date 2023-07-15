<script setup lang="ts">
import LoadingSpinner from '@/components/loading-spinner.vue';
import { computed, onMounted, ref } from 'vue';
import { useApiClient } from '@/composables/api-client/use-api-client';
import ImageThumbnail from '@/components/image-thumbnail.vue';
import { useRoute } from 'vue-router';
import Pagination from '@/components/pagination.vue';
import Voting from '@/components/voting.vue';

const isLoading = ref(false);
const apiClient = useApiClient();
const songs = ref([] as any[]);
const playlist = ref({} as any);
const page = ref(0);
const totalCount = ref(0);
const perPage = ref(0);
const route = useRoute();

onMounted(async () => {
  await loadPlaylists();
});

const playlistId = computed(() => {
  return parseInt(
    typeof route.params.playlistId == 'string'
      ? route.params.playlistId
      : route.params.playlistId[0],
  );
});
function getArtistNames(artists: string[]) {
  return (artists ?? []).join(', ');
}
async function handlePageChange(newPage: number) {
  page.value = newPage;
  await loadPlaylists();
}

async function loadPlaylists() {
  let result: any;
  isLoading.value = true;
  try {
    result = await apiClient.get('/internal/playlists/playlist-songs', {
      page: page.value,
      playlistId: playlistId.value,
    });
    songs.value = result.data.songs;
    playlist.value = result.data.playlist;
    totalCount.value = result.data.totalCount;
    perPage.value = result.data.perPage;
  } catch (e) {
    apiClient.displayGenericError(e, 'Failed to load songs');
  } finally {
    isLoading.value = false;
  }
}
async function updateVote(
  playlistSongId: number,
  newValue: number,
  newNetVotes: number,
) {
  try {
    await apiClient.post('/internal/playlists/playlist-song-vote', {
      playlistSongId: playlistSongId,
      voteValue: newValue,
    });
    const currSongs = songs.value.filter((s) => s.id === playlistSongId);
    if (currSongs.length > 0) {
      currSongs[0].userVoteValue = newValue;
      currSongs[0].netVotes = newNetVotes;
    }
  } catch (e) {
    apiClient.displayGenericError(e, 'Failed to update vote');
  }
}
</script>

<template>
  <div v-if="isLoading" class="text-center mt-5">
    <loading-spinner></loading-spinner>
  </div>
  <div v-else class="row justify-content-center">
    <div class="col-12">
      <div class="d-flex">
        <image-thumbnail
          :image-url="playlist.playlistImageUrl"
          :size-px="75"
        ></image-thumbnail>
        <div class="ps-3">
          <h3>
            {{ playlist.name }}
          </h3>
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

      <div class="mt-5 row d-lg-block">
        <div
          class="col-12 col-lg-6 mb-3 d-flex align-items-center"
          v-for="song of songs"
          v-bind:key="song.id"
        >
          <voting
            class="me-3"
            :net-votes="song.netVotes as number"
            :current-value="song.userVoteValue as number"
            :id="song.id"
            @change-vote="updateVote"
          ></voting>
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
                  <div>
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
      </div>
      <div class="my-5">
        <pagination
          :current-page="page"
          :per-page="perPage"
          :total-count="totalCount"
          @change-page="handlePageChange"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
