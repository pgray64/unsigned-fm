<script setup lang="ts">

</script>

<template>
  <nav class="navbar navbar-expand-md">
    <div class="container">
      <router-link class="navbar-brand" to="/"><img src="../assets/logo-script.svg" height="40" width="200" alt="Unsigned.FM" title="Unsigned.FM"></router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav ms-auto mb-2 mb-md-0">
          <li class="nav-item">
            <router-link class="nav-link fw-semibold me-lg-2" to="/"><i class="bi bi-graph-up-arrow"></i> Trending</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link fw-semibold me-lg-2" to="/"><i class="bi bi-plus-square"></i> Submit</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link fw-semibold e-lg-2" to="/login"><i class="bi bi-box-arrow-in-right"></i> Login</router-link>
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
