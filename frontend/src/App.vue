<template>
  <router-view />
  <teleport to="body">
    <notifications-container />
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NotificationsContainer from './components/NotificationsContainer.vue';

export default defineComponent({
  components: { NotificationsContainer }
});
</script>