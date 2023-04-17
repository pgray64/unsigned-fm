<template>
  <va-navbar color="#ffffff" class="mb-3 border-b border-solid border-gray-300 b">
    <template #left>
      <va-navbar-item class="logo">
        <img src="../../assets/logo-painted.svg" width="218" height="37" />
      </va-navbar-item>
    </template>
    <template #right>
      <va-navbar-item class="d-flex align-center mt-2 mb-2 md:mt-0 md:mb-0">
        <va-button to="/" icon="music_note" color="info" gradient>Discover</va-button>
      </va-navbar-item>
      <va-navbar-item class="mt-2 mb-2 md:mt-0 md:mb-0">
        <va-button to="/" icon="add">Submit</va-button>
      </va-navbar-item>
      <va-navbar-item class="d-flex align-center mt-2 mb-2 md:mt-0 md:mb-0">
        <va-button-dropdown to="/" preset="secondary" border-color="primary" label="Profile">
          <div class="p-2 mb-2">
            <va-button to="/" preset="plain">Settings</va-button>
          </div>
          <div class="p-2">
            <va-button to="/" preset="plain">Sign out</va-button>
          </div>
        </va-button-dropdown>
      </va-navbar-item>
    </template>
  </va-navbar>
</template>

<script setup lang="ts"></script>

<style scoped></style>
