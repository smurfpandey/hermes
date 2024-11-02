<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-vue-next';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  const resp = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });
  if (resp.error) {
    errorMessage.value = resp.error.message;
  } else {
    router.push('/');
  }
  isLoading.value = false;
};

const goToSignup = () => {
  router.push('/signup');
};
const goToForgotPassword = () => {
  router.push('/forgot-password'); // Add navigation to forgot password
};
</script>
<template>
  <Container class="flex h-screen p-4 mt-[-65px]">
    <Card class="w-96 m-auto max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl"> Login </CardTitle>
        <CardDescription>
          Enter your email and password to login
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            v-model="email"
          />
        </div>
        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input id="password" type="password" v-model="password" />
        </div>
        <span v-if="errorMessage" class="text-red-500">{{ errorMessage }}</span>
      </CardContent>
      <CardFooter>
        <Button class="w-full" @click="handleLogin" :disabled="isLoading">
          <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isLoading" />
          Login
        </Button>
        <Button class="w-full" variant="link" @click="goToForgotPassword">
          Forgot Password?
        </Button>
      </CardFooter>
      <div>
        <Button class="w-full" variant="link" @click="goToSignup">
          Don't have an account? Sign up
        </Button>
      </div>
    </Card>
  </Container>
</template>
