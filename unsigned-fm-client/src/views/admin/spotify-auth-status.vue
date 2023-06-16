<script setup lang="ts">
const props = defineProps({ isSuccess: Boolean });
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-12 col-lg-6">
      <h4 class="text-success" v-if="props.isSuccess">
        <i class="bi bi-check2-circle"></i> Successfully authenticated with
        Spotify
      </h4>
      <h4 class="text-danger" v-else>
        <i class="bi bi-x-circle"></i> Failed to authenticate with Spotify
      </h4>
      <div>
        <router-link to="/admin/home">Back to admin panel</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
