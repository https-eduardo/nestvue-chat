<template>
  <div class="chat-message" :class="[{ self }, message.type]">
    <div class="message-container">
      <span
        class="message-username"
        :style="self ? {} : { color: message.color }"
        >{{ self ? "Você" : message.username }}</span
      >
      <p class="message-content">{{ message.content }}</p>
      <span class="message-date">{{ messageDate }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core";
import { useStore } from 'vuex';

export default defineComponent({
  props: {
    message: { type: Object, required: true },
  },
  setup(props) {
    const store = useStore();
    const self = computed(() => {
      return props.message.ownerUserId === store.state.user.id
    });
    const messageDate = computed(() => {
      const date = new Date(props.message.createdAt);
      const formatZero = (value: number) => {
        if (value <= 9 && value >= 0) return '0' + value;
        return value.toString();
      }
      const timeString = `${formatZero(date.getHours())}:${formatZero(date.getMinutes())}`;
      return timeString;
    })
    return { self, messageDate };
  }
});
</script>

<style scoped>
.chat-message {
  max-width: 250px;
  min-width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 20%);
}
.message-container {
  display: flex;
  flex-direction: column;
  background: var(--bg-5);
  min-width: 75%;
  padding: 0.5rem;
  text-align: left;
  border-radius: 4px;
  gap: 0.1rem;
}
.message-username {
  font-size: 0.7rem;
  color: var(--text-5);
  font-weight: 600;
}
.message-date {
  font-size: 0.7rem;
  color: var(--text-5);
  font-weight: 400;
  text-align: right;
  line-height: 0.5rem;
}
.message-content {
  text-align: initial;
  word-break: break-all;
  font-size: 0.9rem;
  color: var(--text-1);
  font-weight: 500;
}
</style>