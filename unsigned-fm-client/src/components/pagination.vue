<script setup lang="ts">
import { computed } from 'vue';

const maxPages = 10;
const props = defineProps({
  totalCount: { type: Number, required: true },
  perPage: { type: Number, required: true },
  currentPage: { type: Number, required: true },
});
const emit = defineEmits(['change-page']);
const numPages = computed(() => {
  return Math.min(Math.ceil(props.totalCount / props.perPage), maxPages);
});
function handlePageChange(newPage: number) {
  emit('change-page', newPage);
}
</script>

<template>
  <nav aria-label="Pagination" v-if="totalCount > perPage">
    <ul class="pagination">
      <li class="page-item" :class="[currentPage < 1 ? 'disabled' : '']">
        <a
          class="page-link"
          href="javascript:void(0)"
          @click="handlePageChange(currentPage - 1)"
          >Previous</a
        >
      </li>
      <li
        class="page-item"
        v-for="n in numPages"
        v-bind:key="n"
        :class="[currentPage === n - 1 ? 'active' : '']"
      >
        <a
          class="page-link"
          href="javascript:void(0)"
          @click="handlePageChange(n - 1)"
          >{{ n }}</a
        >
      </li>
      <li
        class="page-item"
        :class="[currentPage === numPages - 1 ? 'disabled' : '']"
      >
        <a
          class="page-link"
          href="javascript:void(0)"
          @click="handlePageChange(currentPage + 1)"
          >Next</a
        >
      </li>
    </ul>
  </nav>
</template>

<style scoped></style>
