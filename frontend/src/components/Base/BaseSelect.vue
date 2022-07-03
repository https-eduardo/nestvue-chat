<template>
  <div class="base-select" @click="state.collapsed = !state.collapsed">
    <p>{{ state.selected.name }} <i class="fas fa-chevron-down"></i></p>
    <ul class="options" v-show="state.collapsed">
      <li
        v-for="(option, index) in options"
        :key="index"
        :class="{ active: option.value === state.selected.value }"
        @click="select(option)"
      >
        {{ option.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/runtime-core';

export default defineComponent({
  props: {
    defaultValue: { type: Object },
    options: { type: Array, required: true },
  },
  setup(props, { emit }) {
    const state = reactive({
      selected: props.defaultValue ?? props.options[0],
      collapsed: false,
    });
    function select(option: Record<string, string>) {
      if (state.selected !== option) {
        emit('select', option);
        state.selected = option;
      }
    }
    emit('select', state.selected);
    return { state, select };
  }
});
</script>

<style scoped>
.base-select {
  background: var(--bg-1);
  border-radius: 4px;
  position: relative;
  padding: 0.5rem;
  cursor: pointer;
}
.base-select ul {
  display: flex;
  flex-direction: column;
  position: absolute;
  list-style: none;
  left: 0;
  width: 100%;
  padding: 0.5rem 0.5rem;
  border-radius: 4px;
  background: var(--bg-1);
}
.base-select ul li:active {
  color: var(--text-3);
}
.base-select ul li.active {
  color: var(--primary);
}
.base-select p {
  color: var(--primary);
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}
.base-select i {
  position: absolute;
  right: 0.5rem;
  color: var(--text-3);
}
</style>