import { createStore } from 'vuex'

export default createStore({
  state: {
    user: {},
    notifications: [],
  },
  mutations: {
    changeUser(state: any, payload: any) {
      state.user = payload;
    },
    createNotification(state: any, payload: any) {
      state.notifications.push(payload);
      setTimeout(() => {
        const index = state.notifications.indexOf(payload);
        state.notifications.splice(index, 1);
      }, payload.timeout | 5000)
    }
  },
})
