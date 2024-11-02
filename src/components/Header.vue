<script setup>
import { cn } from '@/lib/utils';

import AddTravelPlan from '@/components/AddTravelPlan.vue';
</script>
<template>
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
          <AddTravelPlan />
        </div>
      </div>
    </div>
  </div>
</template>
