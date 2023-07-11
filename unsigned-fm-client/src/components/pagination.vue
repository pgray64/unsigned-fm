<script setup lang="ts">
import { computed } from 'vue';

const maxPages = 100;
const visibilityThreshold = 2; // hide number buttons if more than this many away from current page
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
function isNumberButtonVisible(page: number) {
  return Math.abs(page - props.currentPage) <= visibilityThreshold;
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
      <template v-for="n in numPages" v-bind:key="n">
        <li
          class="page-item"
          :class="[currentPage === n - 1 ? 'active' : '']"
          v-if="isNumberButtonVisible(n - 1)"
        >
          <a
            class="page-link"
            href="javascript:void(0)"
            @click="handlePageChange(n - 1)"
            >{{ n }}</a
          >
        </li>
      </template>

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
