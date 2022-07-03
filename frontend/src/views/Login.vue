<template>
  <div class="default-form-page">
    <base-form title="LOGIN" @submit.prevent="login">
      <base-input
        :error="!!state.error"
        block
        v-model="state.login.email"
        placeholder="junin@gmail.com"
        label="Email"
        required
      />
      <base-input
        :error="!!state.error"
        block
        v-model="state.login.password"
        label="Senha"
        type="password"
        required
      />
      <div class="full-column-flex">
        <span v-show="!!state.error" class="error-message">{{
          state.error
        }}</span>
        <base-button :disabled="state.buttonDisabled"
          >ENTRAR NA SALA <i class="fas fa-arrow-right"
        /></base-button>
        <span class="router-span">
          Não tem uma conta?
          <router-link :to="{ name: 'Register' }">Se cadastre aqui</router-link>
        </span>
      </div>
    </base-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/runtime-core';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import api from '../utils/api';

export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      login: {
        email: '',
        password: ''
      },
      error: '',
      buttonDisabled: false
    });
    function login() {
      state.buttonDisabled = true;
      api.post('auth', { ...state.login }).then((response) => {
        state.buttonDisabled = false;
        state.error = '';
        localStorage.setItem('authToken', response.data);
        router.push({ name: 'Chat' });
      }).catch((err) => {
        let content = "Algum campo está incorreto."
        if (err.response.status === 401)
          content = "Credenciais incorretas.";
        store.commit('createNotification', { type: 'error', content });
        state.error = content;
        state.buttonDisabled = false;
      });
    }
    return { state, login };
  }
});
</script>