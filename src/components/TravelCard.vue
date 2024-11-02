<script setup>
import dayjs from 'dayjs';
import {
  ArrowRight,
  TrainFront,
  Clock,
  Calendar,
  Plane,
} from 'lucide-vue-next';
import { computed, defineProps } from 'vue';

const props = defineProps({
  travel: Object,
});
const travelIcon = computed(() => {
  return props.travel.transport_type === 'FLIGHT' ? Plane : TrainFront;
});
const travelStatus = computed(() => {
  return dayjs(props.travel.departure_datetime).isAfter(dayjs())
    ? 'Upcoming'
    : 'Completed';
});
const statusColorClass = computed(() => {
  return travelStatus.value === 'Upcoming'
    ? 'bg-blue-100 text-blue-800'
    : 'bg-green-100 text-green-800';
});

const departureTime = computed(() => {
  return dayjs(props.travel.departure_datetime).format('hh:mm A');
});

const departureDate = computed(() => {
  return dayjs(props.travel.departure_datetime).format('DD-MMM-YY');
});

const arrivalTime = computed(() => {
  return dayjs(props.travel.arrival_datetime).format('hh:mm A');
});
const arrivalDate = computed(() => {
  return dayjs(props.travel.arrival_datetime).format('DD-MMM-YY');
});
</script>
<template>
  <div class="bg-white rounded-lg shadow p-4 mb-4">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center">
        <component :is="travelIcon" class="text-blue-500 mr-2" />
        <span class="text-sm font-medium capitalize">{{
          travel.transport_type
        }}</span>
      </div>
      <span :class="['text-xs px-2 py-1 rounded-full', statusColorClass]">
        {{ travelStatus }}
      </span>
    </div>

    <div class="flex items-center justify-between mb-3">
      <div class="flex-1">
        <p class="font-semibold">{{ travel.departure_location.name }}</p>
        <div class="flex items-center text-gray-500 text-sm">
          <Clock :size="16" />
          <span class="ml-1"> {{ departureTime }}</span>
        </div>
        <div class="flex items-center text-gray-500 text-sm pt-2">
          <Calendar :size="16" />
          <span class="ml-1">{{ departureDate }}</span>
        </div>
      </div>
      <ArrowRight class="text-gray-400 mx-2" />
      <div class="flex-1 text-right">
        <p class="font-semibold">{{ travel.arrival_location.name }}</p>
        <div class="flex items-center justify-end text-gray-500 text-sm">
          <Clock :size="16" />
          <span class="ml-1">{{ arrivalTime }}</span>
        </div>
        <div class="flex items-center justify-end text-gray-500 text-sm pt-2">
          <Calendar :size="16" />
          <span class="ml-1">{{ arrivalDate }}</span>
        </div>
      </div>
    </div>

    <p class="text-sm text-gray-600 mt-2">
      {{ travel.transport_carrier_code }} {{ travel.transport_number }}
    </p>
  </div>
</template>
