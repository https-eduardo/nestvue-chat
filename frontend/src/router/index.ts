import store from '@/store';
import api from '@/utils/api';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/chat',
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('authToken')) {
        next()
      }
      else next({ name: 'Login' });
    },
    name: 'Chat',
    component: () => import('../views/Chat.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('authToken');
  if (token && !store.state.user.id) {
    const response = await api.get('users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.status === 200 && response.data) {
      store.commit('changeUser', response.data);
    } else {
      localStorage.removeItem('authToken');
      next({ name: 'Login' });
    }
  }
  if (to.name !== 'Chat' && store.state.user.id)
    next({ name: 'Chat' });

  next();
});

export default router;
