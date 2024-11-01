import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faClock, faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faArrowRight, faTrain } from '@fortawesome/free-solid-svg-icons';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import { supabase } from '@/lib/supabaseClient.js';
import '@/assets/index.css';
import App from '@/App.vue';
import Home from '@/components/Home.vue';
import Login from '@/components/Login.vue';

library.add([faArrowRight, faCalendar, faClock, faTrain]);

const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
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

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(router)
  .mount('#app');
