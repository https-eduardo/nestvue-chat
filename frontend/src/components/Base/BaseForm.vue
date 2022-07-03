<template>
  <form class="base-form">
    <h2>{{ title }}</h2>
    <slot />
  </form>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  props: {
    title: String,
  }
});
</script>

<style scoped>
.base-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.base-form h2 {
  color: var(--primary);
  font-size: 2rem;
  text-align: initial;
  font-family: "Inter", sans-serif;
}
</style>