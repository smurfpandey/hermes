<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';

import { Button } from '@/components/ui/button';
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
const confirmPassword = ref('');
const fullName = ref('');
const errors = ref({});

const validateForm = () => {
  errors.value = {};
  if (!fullName.value) errors.value.fullName = 'Full name is required';
  if (!email.value) errors.value.email = 'Email is required';
  if (!password.value) errors.value.password = 'Password is required';
  if (password.value !== confirmPassword.value)
    errors.value.confirmPassword = 'Passwords do not match';
  return Object.keys(errors.value).length === 0;
};

const handleSignup = async () => {
  if (!validateForm()) return;
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        full_name: fullName.value,
      },
    },
  });
  if (error) {
    errors.value.supabase = error.message;
  } else {
    router.push('/login');
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <Container class="flex h-screen p-4 mt-[-65px]">
    <Card class="w-96 m-auto max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl"> Sign up </CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div class="grid gap-2">
          <Label for="fullname">Full Name</Label>
          <Input
            id="fullname"
            type="text"
            placeholder="John Doe"
            v-model="fullName"
          />
          <span v-if="errors.fullName" class="text-red-500">{{
            errors.fullName
          }}</span>
        </div>
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            v-model="email"
          />
          <span v-if="errors.email" class="text-red-500">{{
            errors.email
          }}</span>
        </div>
        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input id="password" type="password" v-model="password" />
          <span v-if="errors.password" class="text-red-500">{{
            errors.password
          }}</span>
        </div>
        <div class="grid gap-2">
          <Label for="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            v-model="confirmPassword"
          />
          <span v-if="errors.confirmPassword" class="text-red-500">{{
            errors.confirmPassword
          }}</span>
        </div>
        <span v-if="errors.supabase" class="text-red-500">{{
          errors.supabase
        }}</span>
      </CardContent>
      <CardFooter>
        <Button class="w-full" @click="handleSignup"> Sign up </Button>
        <Button class="w-full" variant="link" @click="goToLogin">
          Already have a account? Login
        </Button>
      </CardFooter>
    </Card>
  </Container>
</template>
