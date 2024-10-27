<script setup>
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
// import { EnvelopeOpenIcon } from '@radix-icons/vue';
import Home from './components/Home.vue';
</script>

<template>
  <div class="bg-zinc-950 dark:bg-white h-screen w-screen">
    <div class="flex-col md:flex">
      <div class="border-b">
        <div class="flex h-16 items-center px-4">
          <nav
            :class="
              cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')
            "
          >
            <h3
              class="scroll-m-20 text-2xl font-semibold tracking-tight text-white"
            >
              <a href="#" class="mr-auto flex items-center gap-2"> Hermes </a>
            </h3>
          </nav>
          <div class="ml-auto flex items-center space-x-4">
            <Button> + Add Travel </Button>
          </div>
        </div>
      </div>
    </div>

    <Home />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
