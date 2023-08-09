<script setup lang="ts">
function redirectToGoogleSignIn() {
  window.location.href = '/internal/auth/google';
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-12 col-lg-6">
      <h4>Log In</h4>
      <p class="text-muted">
        You'll be able to submit songs to playlists, vote on them, and have a
        customized experience.
      </p>
      <div class="pt-4 d-flex justify-content-center">
        <button
          class="btn btn-link"
          @click="redirectToGoogleSignIn"
          title="Sign in with Google"
        >
          <img src="../assets/google-normal.png" id="google-btn" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#google-btn {
  height: 60px;
}
#google-btn:hover {
  filter: brightness(98%);
}
#google-btn:active {
  filter: brightness(95%);
}
</style>
