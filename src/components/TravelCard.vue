<script setup>
import { ArrowRight, TrainFront, Clock, Calendar } from 'lucide-vue-next';
</script>
<template>
  <div class="bg-white rounded-lg shadow p-4 mb-4">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center">
        <TrainFront class="text-blue-500 mr-2" />
        <span class="text-sm font-medium capitalize">Train</span>
      </div>
      <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
        Upcoming
      </span>
    </div>

    <div class="flex items-center justify-between mb-3">
      <div class="flex-1">
        <p class="font-semibold">Mumbai</p>
        <div class="flex items-center text-gray-500 text-sm">
          <Clock :size="16" />
          <span class="ml-1">16:30</span>
        </div>
      </div>
      <ArrowRight class="text-gray-400 mx-2" />
      <div class="flex-1 text-right">
        <p class="font-semibold">Ballia</p>
        <div class="flex items-center justify-end text-gray-500 text-sm">
          <Clock :size="16" />
          <span class="ml-1">16:30</span>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-start text-sm text-gray-500">
      <Calendar :size="16" />
      <span class="ml-1">23-Dec-2024</span>
    </div>

    <p class="text-sm text-gray-600 mt-2">IR 22159</p>
  </div>
</template>
