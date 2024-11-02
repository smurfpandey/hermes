<script setup>
import { ref, onMounted } from 'vue';
import { Skeleton } from '@/components/ui/skeleton';
import TravelCard from '@/components/TravelCard.vue';
import { supabase } from '@/lib/supabaseClient';

const travels = ref([]);
const fetchTravels = async () => {
  const { data, error } = await supabase
    .from('travel_plan')
    .select('*')
    .order('departure_datetime', { ascending: true });

  if (error) {
    console.error('Error fetching travel data:', error);
  } else {
    travels.value = data;
  }
};

onMounted(fetchTravels);
</script>

<template>
  <div class="w-full max-w-lg mx-auto h-screen p-4 overflow-scroll">
    <div v-if="travels.length === 0">
      <div class="flex flex-col space-y-3 mb-4">
        <Skeleton class="h-[125px] w-full rounded-xl" />
        <div class="space-y-2">
          <Skeleton class="h-4 w-[250px]" />
          <Skeleton class="h-4 w-[200px]" />
        </div>
      </div>
    </div>
    <div v-else>
      <TravelCard v-for="travel in travels" :key="travel.id" :travel="travel" />
    </div>
  </div>
</template>

<style scoped></style>
