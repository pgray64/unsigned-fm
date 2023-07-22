<script setup lang="ts">
import LoadingSpinner from '@/components/loading-spinner.vue';
import { computed, onMounted, ref } from 'vue';
import { useApiClient } from '@/composables/api-client/use-api-client';
import ImageThumbnail from '@/components/image-thumbnail.vue';
import { toast } from 'vue3-toastify';
import Pagination from '@/components/pagination.vue';

const apiClient = useApiClient();
const isLoading = ref(true);
const users = ref(null as any);
const username = ref('');
const page = ref(0);
const totalCount = ref(0);
const perPage = ref(0);

onMounted(async () => {
  await loadUsers();
});

async function loadUsers() {
  isLoading.value = true;
  let result = null as any;
  try {
    result = await apiClient.get('/internal/admin/users/search', {
      username: username.value,
      page: page.value,
    });
  } catch (e) {
    apiClient.displayGenericError(e, 'Failed to load users');
  }
  users.value = result.data?.users;
  totalCount.value = result.data?.totalCount;
  perPage.value = result.data?.perPage;
  isLoading.value = false;
}

async function handlePageChange(newPage: number) {
  page.value = newPage;
  await loadUsers();
}

async function updateUser(user: any) {
  isLoading.value = true;
  try {
    await apiClient.post('/internal/admin/users/set-ban-status', {
      userId: user.id,
      isBanned: user.isBanned,
    });
    toast.success('User ban status updated');
  } catch (e) {
    apiClient.displayGenericError(e, 'Failed set ban status');
  } finally {
    isLoading.value = false;
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
        <h5>Users</h5>
        <form class="form" @submit.prevent="loadUsers">
          <div class="input-group input-group" style="max-width: 500px">
            <input class="form-control" type="text" v-model="username" />
            <button type="submit" class="btn btn-success">Search</button>
          </div>
        </form>
        <div v-if="isLoading" class="text-center mt-4">
          <loading-spinner></loading-spinner>
        </div>
        <div v-else-if="users" class="justify-content-center mt-4">
          <div class="row">
            <div class="col-12">
              <div>
                <table class="table" v-if="users.length > 0">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Name</th>
                      <th>Banned</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="" v-for="user of users" v-bind:key="user.id">
                      <td>
                        <router-link :to="'/admin/users/details/' + user.id">
                          {{ user.username }}
                        </router-link>
                      </td>
                      <td>{{ user.firstName }} {{ user.lastName }}</td>
                      <td class="p-2">
                        Banned: <span>{{ user.isBanned ? 'Y' : 'N' }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p v-else><em>No users found</em></p>
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
    </div>
  </div>
</template>

<style scoped></style>
