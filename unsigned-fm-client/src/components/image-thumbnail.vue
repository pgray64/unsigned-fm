<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  imageUrl: String,
  sizePx: Number,
});
</script>

<template>
  <div
    class="overflow-hidden"
    :class="[imageUrl ? '' : 'border']"
    :style="{ width: props.sizePx + 'px', height: props.sizePx + 'px' }"
  >
    <div
      v-if="imageUrl"
      :src="imageUrl"
      :style="{
        backgroundImage: `url(${imageUrl})`,
      }"
      style="
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-repeat: no-repeat;
        height: 100%;
        width: 100%;
      "
    />
    <div
      v-else
      class="d-flex align-items-center justify-content-center"
      :style="{ width: props.sizePx + 'px', height: props.sizePx + 'px' }"
    >
      <i class="bi bi-music-note-beamed text-muted"></i>
    </div>
  </div>
</template>

<style scoped></style>
