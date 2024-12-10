import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import { supabase } from '@/lib/supabaseClient.js';
import { getAuth0App, authGuard } from '@/lib/auth.js';
import '@/assets/index.css';
import App from '@/App.vue';
import Home from '@/components/Home.vue';
import Login from '@/components/Login.vue';
import Signup from '@/components/Signup.vue';
import ForgotPassword from '@/components/ForgotPassword.vue';

const routes = [{ path: '/', component: Home, beforeEnter: authGuard }];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App).use(router).use(getAuth0App()).mount('#app');
