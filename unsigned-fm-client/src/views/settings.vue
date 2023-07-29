<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useApiClient } from '@/composables/api-client/use-api-client';
import LoadingSpinner from '@/components/loading-spinner.vue';
import { useSession } from '@/stores/session';

const apiClient = useApiClient();
const userInfo = ref(null as any);
const isLoading = ref(true);
const session = useSession();
onMounted(async () => {
  await loadUserInfo();
});

async function loadUserInfo() {
  let userResponse = null as any;
  try {
    userResponse = await apiClient.get('/internal/users/profile');
  } catch (e) {
    apiClient.displayGenericError(e, 'Failed to load user data');
  }
  userInfo.value = userResponse.data;
  isLoading.value = false;
}
const logOut = function () {
  session.logOut();
  window.location.href = '/';
};
async function deleteAccount() {
  if (
    !confirm(
      "Are you sure you want to delete your account? This can't be undone.",
    )
  ) {
    return;
  }
  isLoading.value = true;
  try {
    await apiClient.post('/internal/users/delete-account');
    logOut();
  } catch (e) {
    apiClient.displayGenericError(e, 'Failed to delete account');
  }

  isLoading.value = false;
}
</script>

<template>
  <div v-if="isLoading" class="text-center mt-5">
    <loading-spinner></loading-spinner>
  </div>
  <div v-else class="row justify-content-center">
    <div class="col-12 col-lg-6">
      <h4>Account</h4>
      <ul class="list-group">
        <li class="list-group-item">
          <div class="fw-bold small">Username</div>
          <div>{{ userInfo.username }}</div>
        </li>
        <li class="list-group-item">
          <div class="fw-bold small">First name</div>
          <div>{{ userInfo.firstName }}</div>
        </li>
        <li class="list-group-item">
          <div class="fw-bold small">Last name</div>
          <div>{{ userInfo.lastName }}</div>
        </li>
      </ul>
      <div class="mt-3">
        <button class="btn btn-danger me-2" @click="deleteAccount()">
          Delete account
        </button>
        <button class="btn btn-outline-secondary" @click="logOut()">
          Log out
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
