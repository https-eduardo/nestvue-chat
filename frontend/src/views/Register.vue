<template>
  <div class="default-form-page">
    <base-form title="REGISTER" @submit.prevent="register">
      <base-input
        :error="!!state.error"
        v-model="state.register.name"
        label="Nome de usuário"
        placeholder="Junin"
        required
        block
      />
      <base-input
        :error="!!state.error"
        v-model="state.register.email"
        label="Email"
        placeholder="junin@gmail.com"
        required
        block
      />
      <base-input
        :error="!!state.error"
        v-model="state.register.password"
        label="Senha"
        type="password"
        block
        required
      />
      <div class="full-column-flex">
        <span v-show="!!state.error" class="error-message">{{
          state.error
        }}</span>
        <base-button type="submit" :disabled="state.buttonDisabled"
          >Cadastrar</base-button
        >
        <span class="router-span"
          >Já tem uma conta?
          <router-link :to="{ name: 'Login' }">Fazer login</router-link></span
        >
      </div>
    </base-form>
  </div>
</template>

<script lang="ts">
import api from '@/utils/api';
import { defineComponent, reactive } from '@vue/runtime-core';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const state = reactive({
      register: {
        name: '',
        email: '',
        password: ''
      },
      error: '',
      buttonDisabled: false,
    });
    const router = useRouter();
    const store = useStore();
    function register() {
      state.buttonDisabled = true;
      api.post('users', { ...state.register }).then(() => {
        state.buttonDisabled = false;
        state.error = '';
        router.push({ name: 'Login' });
      }).catch((err) => {
        let content = "Algum campo está incorreto."
        if (err.response.status >= 500)
          content = "Servidor está offline.";
        store.commit('createNotification', { type: 'error', content });
        state.error = content;
        state.buttonDisabled = false;
      });
    }
    return { state, register };
  }
});
</script>