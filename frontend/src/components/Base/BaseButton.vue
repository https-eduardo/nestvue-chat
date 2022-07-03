<template>
  <button class="base-button" :class="{ disabled }"><slot /></button>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  props: {
    disabled: Boolean,
  },
});
</script>

<style scoped>
.base-button {
  padding: 0.75rem;
  border: none;
  font-weight: 600;
  background: var(--bg-4);
  color: var(--primary);
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.base-button.disabled {
  transition: opacity 0.1s ease-in;
  opacity: 0.7;
}
</style>