<script setup>
import { ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'vue-router';
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

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const message = ref('');
const error = ref('');
const router = useRouter();

const handleForgotPassword = async () => {
  const redirectTo = `${window.location.origin}/reset-password`; // Add redirect URL
  const resp = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo,
  });
  if (resp.error) {
    message.value = '';
    error.value = resp.error.message;
  } else {
    message.value = 'Password reset link has been sent to your email.';
    error.value = '';
  }
};

const handleResetPassword = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }

  const resp = await supabase.auth.updateUser({
    password: password.value,
  });
  if (resp.error) {
    message.value = '';
    error.value = resp.error.message;
  } else {
    message.value = 'Password has been reset successfully.';
    error.value = '';
    router.push('/login');
  }
};

// Check if the URL path is '/reset-password'
const isReset = router.currentRoute.value.path === '/reset-password';
</script>

<template>
  <Container class="flex h-screen p-4 mt-[-65px]">
    <Card class="w-96 m-auto max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl">{{
          isReset ? 'Reset Password' : 'Forgot Password'
        }}</CardTitle>
        <CardDescription>
          {{
            isReset
              ? 'Enter your new password.'
              : 'Enter your email to reset your password.'
          }}
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div class="grid gap-2" v-if="!isReset">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            v-model="email"
          />
        </div>
        <div class="grid gap-2" v-else>
          <Label for="password">New Password</Label>
          <Input id="password" type="password" v-model="password" />
          <Label for="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            v-model="confirmPassword"
          />
        </div>
        <span v-if="message" class="text-green-500">{{ message }}</span>
        <span v-if="error" class="text-red-500">{{ error }}</span>
      </CardContent>
      <CardFooter>
        <Button
          class="w-full"
          @click="isReset ? handleResetPassword() : handleForgotPassword()"
        >
          {{ isReset ? 'Reset Password' : 'Send Reset Link' }}
        </Button>
      </CardFooter>
    </Card>
  </Container>
</template>
