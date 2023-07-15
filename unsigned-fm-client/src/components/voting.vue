<script setup lang="ts">
import { useSession } from '@/stores/session';
import { computed } from 'vue';

const session = useSession();
const props = defineProps({
  currentValue: { type: Number, required: true },
  netVotes: { type: Number, required: true },
  id: { type: Number, required: true },
});
const emit = defineEmits(['change-vote']);

const isLoggedIn = computed(() => {
  return session.isLoggedIn;
});

function handleVoteChange(valueClicked: number) {
  if (!isLoggedIn.value) {
    return;
  }
  const newVal = valueClicked === props.currentValue ? 0 : valueClicked;
  const delta = newVal - props.currentValue;
  const newNetVotes = props.netVotes + delta; // we want the displayed votes to update instantly
  emit('change-vote', props.id, newVal, newNetVotes);
}
</script>

<template>
  <div class="d-flex flex-column align-items-center">
    <div
      :class="[isLoggedIn ? 'text-primary' : 'text-dark']"
      :style="{ cursor: isLoggedIn ? 'pointer' : 'inherit' }"
      @click="handleVoteChange(1)"
    >
      <i
        class="bi"
        :class="[currentValue === 1 ? 'bi-caret-up-fill' : 'bi-caret-up']"
        style="font-size: 30px"
      ></i>
    </div>
    <div>
      <b>{{ netVotes }}</b>
    </div>
    <div
      :class="[isLoggedIn ? 'text-primary' : 'text-dark']"
      :style="{ cursor: isLoggedIn ? 'pointer' : 'inherit' }"
      @click="handleVoteChange(-1)"
    >
      <i
        class="bi"
        :class="[currentValue === -1 ? 'bi-caret-down-fill' : 'bi-caret-down']"
        style="font-size: 30px"
      ></i>
    </div>
  </div>
</template>

<style scoped></style>
