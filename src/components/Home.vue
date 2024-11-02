<script setup>
import { Skeleton } from '@/components/ui/skeleton';
import TravelCard from '@/components/TravelCard.vue';
</script>

<template>
  <div class="w-full max-w-lg mx-auto p-4">
    <div class="flex flex-col space-y-3 mb-4">
      <Skeleton class="h-[125px] w-full rounded-xl" />
      <div class="space-y-2">
        <Skeleton class="h-4 w-[250px]" />
        <Skeleton class="h-4 w-[200px]" />
      </div>
    </div>

    <TravelCard />
  </div>
</template>

<style scoped></style>
