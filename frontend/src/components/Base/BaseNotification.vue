<template>
  <div class="base-notification" :class="type">
    <i :class="icon" />
    <p>{{ content }}</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core";
export default defineComponent({
  props: {
    type: { type: String, required: true, default: "success" },
    content: { type: String, required: true },
  },
  setup(props) {
    const icon = computed(() => {
      switch (props.type) {
        case "success":
          return "fa-regular fa-circle-check";
        case "info":
          return "fa-regular fa-circle-info";
        case "error":
          return "fa-regular fa-circle-xmark";
        default:
          return "fa-regular fa-circle-check";
      }
    });
    return { icon };
  },
});
</script>

<style scoped>
.base-notification {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  align-items: center;
  border-radius: 4px;
  background: var(--bg-2);
}
.base-notification p {
  color: var(--text-1);
}
.base-notification.success i {
  color: var(--success);
}
.base-notification.error i {
  color: var(--error);
}
.base-notification.info i {
  color: var(--info);
}
</style>