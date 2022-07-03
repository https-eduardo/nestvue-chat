<template>
  <div class="base-input" :class="{ block, error }">
    <p v-show="!!label">{{ label }}</p>
    <input
      class="base-input"
      :value="modelValue"
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: '',
      required: true
    },
    error: Boolean,
    label: String,
    block: Boolean,
  },
});
</script>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}
.base-input.block input {
  width: 100%;
}
.base-input.error input {
  border: 1px solid var(--error);
}
.base-input p {
  font-size: 0.9rem;
}
.base-input input {
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  border-radius: 4px;
  border: 1px solid var(--text-1);
  padding: 0.75rem;
  font-family: 0.9rem;
  background: transparent;
  color: var(--text-1);
  outline: none !important;
}
.base-input input:focus {
  border: 1px solid var(--primary);
}
</style>