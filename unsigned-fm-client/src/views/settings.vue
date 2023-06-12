<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useApiClient } from '@/composables/api-client/use-api-client'
import LoadingSpinner from '@/components/loading-spinner.vue'

const apiClient = useApiClient()
const userInfo = ref(null as any)
const isLoading = ref(true)
onMounted(async () => {
  await loadUserInfo()
  await apiClient.get('/internal/admin/test')
})

async function loadUserInfo() {
  let userResponse = null as any
  try {
    userResponse = await apiClient.get('/internal/users/profile')
  } catch (e) {
    apiClient.handleGenericError(e, 'Failed to load user data')
  }
  userInfo.value = userResponse.data
  isLoading.value = false
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
    </div>
  </div>
</template>

<style scoped></style>
