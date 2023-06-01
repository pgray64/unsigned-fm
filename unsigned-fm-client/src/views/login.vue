<script setup lang="ts">
  function redirectToGoogleSignIn() {
    window.location.href = '/internal/auth/google';
  }
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-12 col-lg-6">
      <h4>Log In</h4>
      <p class="text-muted">You'll be able to submit songs to playlists, vote on them, and have a customized experience.</p>
      <div class="pt-4 d-flex justify-content-center">
          <button class="btn btn-outline-primary" @click="redirectToGoogleSignIn"><i class="bi bi-google me-1"></i> Sign in with Google</button>
        </div>
    </div>
  </div>

</template>

<style scoped>

</style>
