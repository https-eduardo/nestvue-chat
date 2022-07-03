<template>
  <div class="notifications">
    <base-notification
      v-for="notification in notifications"
      :type="notification.type"
      :content="notification.content"
      :key="notification"
    ></base-notification>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();
    const notifications = store.state.notifications;
    return { notifications };
  },
});
</script>

<style scoped>
.notifications {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
}
</style>