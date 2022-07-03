<template>
  <div class="chat-container">
    <main>
      <div class="title-container">
        <base-select
          :options="state.rooms"
          @select="handleUpdateRoom"
        ></base-select>
        <p v-show="state.typingUsers.length > 0" class="typing-list">
          {{ typingUsersList }}
        </p>
      </div>
      <div class="messages" ref="messagesContainer">
        <transition-group appear name="scale">
          <chat-message
            class="message"
            v-for="(message, index) in state.messages"
            :key="index"
            :message="message"
          >
          </chat-message>
        </transition-group>
      </div>
      <form class="message-send" @submit.prevent="submitMessage">
        <base-input
          type="text"
          v-model="state.message"
          required
          @keypress="emitTyping"
          @keyup="emitNotTyping"
          placeholder="Mensagem"
        />
        <base-button type="submit"
          >Enviar <i class="fas fa-paper-plane"
        /></base-button>
      </form>
    </main>
    <div class="users-list">
      <h3>Usuários</h3>
      <p v-for="user in state.users" :key="user.mongoId">{{ user.username }}</p>
    </div>
    <i class="logout fas fa-times" @click="logout"></i>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/runtime-core';
import ChatMessage from '../components/ChatMessage.vue';
import socketIo from 'socket.io-client';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: { ChatMessage },
  setup() {
    const messagesContainer = ref<Element>();
    const store = useStore();
    let timer: number;
    const state = reactive({
      message: '',
      room: {} as Record<string, string>,
      rooms: [
        { name: "⚝ Not Cria's room", value: 'notcriasroom' },
        { name: "✪ Cria's room", value: 'criasroom' },
      ],
      users: [] as any[],
      typingUsers: [] as any[],
      messages: [] as any[],
    });
    const router = useRouter();
    const socket = socketIo(`${process.env.VUE_APP_BACKEND_URL}/chat`, {
      reconnectionAttempts: 3,
      reconnectionDelay: 5000, extraHeaders: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    });
    function scrollBottom() {
      if (messagesContainer.value) {
        const el = messagesContainer.value;
        el.scrollTo({ behavior: 'smooth', top: el.scrollHeight });
      }
    }
    socket.on('usersList', (users: any[]) => {
      state.users = users;
    });
    socket.on('lastMessages', (messages) => {
      state.messages = messages;
    });
    socket.on('newMessage', (message) => {
      state.messages.push(message);
      setTimeout(scrollBottom, 250);
    });
    socket.on('myInfo', (user) => {
      store.commit('changeUser', user);
    });
    socket.on('typingList', (users: any[]) => {
      const filteredUsers = users.filter((user) => user.mongoId !== store.state.user.id);
      state.typingUsers = filteredUsers;
    });
    function submitMessage() {
      socket.emit('newMessage', { message: state.message, room: state.room.value });
      socket.emit("isTyping", { value: false, room: state.room.value });
      state.message = '';
    }
    function logout() {
      socket.disconnect();
      store.commit('changeUser', {});
      localStorage.removeItem('authToken');
      router.push({ name: 'Login' });
    }
    const typingUsersList = computed(() => {
      const usernames = state.typingUsers.map((user) => user.username);
      let text = usernames.join();
      const namesLength = usernames.length;
      if (namesLength == 1)
        text += " está digitando...";
      else {
        if (namesLength <= 3) text += " estão digitando...";
        else text = "Várias pessoas estão digitando...";
      }
      return text;
    });
    function emitTyping() {
      socket.emit("isTyping", { value: true, room: state.room.value });
      if (timer) {
        clearTimeout(timer);
      }
    }
    function emitNotTyping() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        socket.emit("isTyping", { value: false, room: state.room.value });
      }, 2000);
    }
    setTimeout(scrollBottom, 250);

    function handleUpdateRoom(room: Record<string, string>) {
      state.room = room;
      socket.emit('enterRoom', state.room.value);
    }
    return { logout, submitMessage, state, messagesContainer, emitTyping, emitNotTyping, typingUsersList, handleUpdateRoom }
  }
});
</script>

<style scoped>
.title-container {
  width: 100%;
  text-align: left;
}
.title {
  color: var(--primary);
}
.messages {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 50vh;
  gap: 0.5rem;
  padding-right: 0.5rem;
  overflow-y: auto;
}
.message {
  align-self: flex-start;
}
.message.self {
  align-self: flex-end;
}
.typing-list {
  font-size: 0.9rem;
  margin: 0.5rem 0;
}
.chat-container {
  border-radius: 8px;
  display: flex;
  background: var(--bg-2);
  gap: 2rem;
  position: relative;
  padding: 2.5rem 2.5rem 1.25rem 2.5rem;
}
.chat-container main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}
.users-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 1rem;
}
.scale-enter-active {
  transition: transform 0.2s ease;
}
.scale-enter-from {
  transform: scale(0.8) translateY(1rem);
}
.message-send {
  width: 100%;
  display: flex;
  gap: 0.5rem;
}
.logout {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: red;
  cursor: pointer;
}
.message-send input {
  flex: 1;
}
@media screen and (max-width: 600px) {
  .chat-container {
    width: 100%;
  }
  .chat-container .messages {
    flex: 1;
  }
}
</style>