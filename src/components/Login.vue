<script setup>
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
import { useRouter } from 'vue-router';

const router = useRouter();
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
        <CardTitle class="text-2xl"> Create an account </CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button class="w-full"> Create account </Button>
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
