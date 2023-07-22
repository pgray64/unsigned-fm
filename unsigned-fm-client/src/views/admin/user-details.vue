<script setup lang="ts">
import LoadingSpinner from '@/components/loading-spinner.vue';
import { computed, onMounted, ref } from 'vue';
import { useApiClient } from '@/composables/api-client/use-api-client';
import ImageThumbnail from '@/components/image-thumbnail.vue';
import { toast } from 'vue3-toastify';
import Pagination from '@/components/pagination.vue';
import { useRoute } from 'vue-router';
import Voting from '@/components/voting.vue';

const apiClient = useApiClient();
const isLoadingUser = ref(true);
const isLoadingPlaylistSongs = ref(true);
const user = ref(null as any);
const playlistSongs = ref([] as any[]);
const page = ref(0);
const totalCount = ref(0);
const perPage = ref(0);
const route = useRoute();

const userId = computed(() => {
  return parseInt(
    typeof route.params.userId === 'string'
      ? route.params.userId
      : route.params.userId[0],
  );
});

onMounted(async () => {
  await Promise.all([loadUser(), loadPlaylistSongs()]);
});

async function loadUser() {
  isLoadingUser.value = true;
  let result = null as any;
  try {
    result = await apiClient.get('/internal/admin/users/', {
      id: userId.value,
    });
  } catch (e) {
    apiClient.displayGenericError(e, 'Failed to load user');
  }
  user.value = result.data;
  isLoadingUser.value = false;
}
async function loadPlaylistSongs() {
  let result: any;
  isLoadingPlaylistSongs.value = true;
  try {
    result = await apiClient.get(
      '/internal/admin/playlists/playlist-songs-by-user',
      {
        page: page.value,
        userId: userId.value,
      },
    );
    playlistSongs.value = result.data.songs;
    totalCount.value = result.data.totalCount;
    perPage.value = result.data.perPage;
  } catch (e) {
    apiClient.displayGenericError(e, 'Failed to load songs');
  } finally {
    isLoadingPlaylistSongs.value = false;
  }
}

async function handlePageChange(newPage: number) {
  page.value = newPage;
  await loadPlaylistSongs();
}

function getArtistNames(artists: string[]) {
  return (artists ?? []).join(', ');
}

async function updateUser() {
  isLoadingUser.value = true;
  try {
    await apiClient.post('/internal/admin/users/set-ban-status', {
      userId: user.value.id,
      isBanned: user.value.isBanned,
    });
    toast.success('User ban status updated');
  } catch (e) {
    apiClient.displayGenericError(e, 'Failed set ban status');
  } finally {
    isLoadingUser.value = false;
  }
}
</script>

<template>
  <div class="row">
    <div class="col-12">
      <h4>
        <router-link to="/admin/home">Admin</router-link>
      </h4>
      <div class="mt-4">
        <h5>{{ user.username }}</h5>
        <div v-if="isLoadingUser" class="text-center mt-4">
          <loading-spinner></loading-spinner>
        </div>
        <div v-else class="mt-2">
          <div class="mt-1"><b>Username: </b> {{ user.username }}</div>
          <div class="mt-1">
            <b>Name: </b> {{ user.firstName }} {{ user.lastName }}
          </div>
          <div class="mt-1">
            <label for="user-is-banned" class="form-label me-1"
              ><b>Is Banned: </b></label
            >
            <span class="form-switch">
              <input
                v-model="user.isBanned"
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="user-is-banned"
              />
            </span>
          </div>

          <div class="mt-2">
            <button class="btn btn-sm btn-primary" @click="updateUser()">
              Save
            </button>
          </div>
          <hr />
          <div class="mt-4">
            <h5>Song Submissions</h5>
            <div v-if="isLoadingPlaylistSongs" class="text-center mt-4">
              <loading-spinner></loading-spinner>
            </div>
            <div
              v-else-if="playlistSongs.length > 0"
              class="mt-5 row d-lg-block"
            >
              <div
                class="col-12 col-lg-6 mb-3 d-flex align-items-center"
                v-for="song of playlistSongs"
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
            <p v-else><em>No submissions found</em></p>
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
      </div>
    </div>
  </div>
</template>

<style scoped></style>
