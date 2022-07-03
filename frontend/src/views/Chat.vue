<template>
  <div class="chat">
    <transition appear name="opacity">
      <chat-container />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import ChatContainer from '../components/ChatContainer.vue';

export default defineComponent({
  components: {
    ChatContainer,
  },
});
</script>

<style scoped>
.chat {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.opacity-enter-active {
  transition: all 1s ease;
}
.opacity-enter-from {
  transform: translateY(-20%) scale(1.05);
  opacity: 0;
}
@media screen and (max-width: 600px) {
  .chat {
    align-items: initial;
    justify-content: initial;
  }
}
</style>