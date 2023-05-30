<script setup lang="ts">
  function redirectToGoogleSignIn() {
    window.location.href = '/internal/auth/google';
  }
</script>

<template>
  <div class="d-flex justify-content-center align-items-center flex-column">
    <div>
      <h2>Log In</h2>
      <p>You'll be able to submit songs to playlists, vote on them, and have a customized experience.</p>
    </div>
    <div class="pt-4">
      <button class="btn btn-outline-primary" @click="redirectToGoogleSignIn"><i class="bi bi-google me-1"></i> Sign in with Google</button>
    </div>
  </div>
</template>

<style scoped>

</style>
