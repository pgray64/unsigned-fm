<script setup lang="ts">
import { useSession } from '@/stores/session';
import { computed } from 'vue';
import { useApiClient } from '@/composables/api-client/use-api-client';
import { useRouter } from 'vue-router';

const router = useRouter();
const session = useSession();
const isLoggedIn = computed(() => {
  return session.isLoggedIn;
});
const logOut = async function () {
  session.logOut();
  window.location.href = '/';
};
const isAdmin = computed(() => {
  return session.isAdmin;
});
</script>

<template>
  <nav class="navbar navbar-expand-md">
    <div class="container">
      <router-link class="navbar-brand" to="/"
        ><img
          src="../assets/logo.svg"
          height="50"
          width="212"
          alt="unsigned.fm"
          title="unsigned.fm"
      /></router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav ms-auto mb-2 mb-md-0">
          <li class="nav-item" v-if="isAdmin">
            <router-link class="nav-link me-lg-2" to="/admin/home"
              ><i class="bi bi-gear"></i> Admin</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link me-lg-2" to="/playlists"
              ><i class="bi bi-music-note-list"></i> Playlists</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link me-lg-2" to="/submit"
              ><i class="bi bi-plus-square me-1"></i> Submit</router-link
            >
          </li>

          <li class="nav-item dropdown" v-if="isLoggedIn">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-person-circle me-1"></i> Account
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" to="/settings"
                  >Settings</router-link
                >
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button class="dropdown-item btn-link" @click="logOut">
                  Log out
                </button>
              </li>
            </ul>
          </li>
          <li class="nav-item" v-else>
            <router-link class="nav-link" to="/login"
              ><i class="bi bi-box-arrow-in-right me-1"></i> Login</router-link
            >
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

<style scoped></style>
