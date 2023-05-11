<script setup lang="ts">

</script>

<template>
  <nav class="navbar navbar-expand-md navbar-light bg-light border-bottom">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/"><img src="../assets/logo-painted.svg" height="30" width="175" alt="Unsigned.FM" title="Unsigned.FM"></router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav ms-auto mb-2 mb-md-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/login">Log in</router-link>
          </li>
        </ul>
        <!--
        <form class="d-flex">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
        -->
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>
