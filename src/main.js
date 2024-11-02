import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import { supabase } from '@/lib/supabaseClient.js';
import '@/assets/index.css';
import App from '@/App.vue';
import Home from '@/components/Home.vue';
import Login from '@/components/Login.vue';
import Signup from '@/components/Signup.vue';
import ForgotPassword from '@/components/ForgotPassword.vue';

const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/reset-password', component: ForgotPassword },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const supaResp = await supabase.auth.getSession();

  if (!requiresAuth) {
    return next();
  }

  if (
    supaResp &&
    supaResp.data &&
    supaResp.data.session &&
    supaResp.data.session.user
  ) {
    return next();
  }

  return next('/login');
});

createApp(App).use(router).mount('#app');
