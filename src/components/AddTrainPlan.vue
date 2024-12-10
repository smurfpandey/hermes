<script setup>
import { find } from 'lodash-es';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-vue-next';
import dayjs from 'dayjs';
import { defineEmits, ref } from 'vue';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { supabase } from '@/lib/supabaseClient';
import { getPnrStatus, getStationDetail } from '@/lib/indianRailClient';

const emit = defineEmits(['update:isParentSheetOpen']);

const errorMessage = ref('');
const isLoading = ref(false);
const isPnrLoading = ref(false);
const pnrNumber = ref('');
const trainNumber = ref('');
const departureStationCode = ref('');
const departureStationName = ref('');
const arrivalStationCode = ref('');
const arrivalStationName = ref('');

const fetchPNRDetail = async () => {
  if (!pnrNumber.value || !/^\d{6,10}$/.test(pnrNumber.value)) {
    return;
  }
  const pnrData = await getPnrStatus(pnrNumber.value);

  if (!pnrData.success) {
    errorMessage.value = 'Could not fetch PNR details!';
    return;
  }

  trainNumber.value = pnrData.data.trainNumber;
  departureStationCode.value = pnrData.data.sourceStation;
  arrivalStationCode.value = pnrData.data.destinationStation;

  let respData = await getStationDetail(departureStationCode.value);
  let station = find(respData, (stn) => {
    return stn.code === departureStationCode.value;
  });
  if (station) {
    departureStationName.value = station.name;
  }

  respData = await getStationDetail(arrivalStationCode.value);
  station = find(respData, (stn) => {
    return stn.code === arrivalStationCode.value;
  });
  if (station) {
    arrivalStationName.value = station.name;
  }
};

const saveTrainPlan = async () => {
  console.log('Save Train Plan');
};
</script>

<template>
  <div class="space-y-8 mt-4">
    <div class="grid gap-2">
      <Label for="pnrNumber">PNR Number</Label>
      <div class="relative w-full max-w-sm items-center">
        <Input
          id="pnrNumber"
          type="text"
          placeholder=""
          v-model="pnrNumber"
          @focusout="fetchPNRDetail"
        />
        <span
          class="absolute end-0 inset-y-0 flex items-center justify-center px-2"
        >
          <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isPnrLoading" />
        </span>
      </div>
    </div>

    <div class="grid gap-2">
      <Label for="trainNumber">Train Number</Label>
      <div class="relative w-full max-w-sm items-center">
        <Input
          id="trainNumber"
          type="text"
          placeholder=""
          v-model="trainNumber"
          disabled
        />
      </div>
    </div>
    <div class="grid gap-2">
      <Label for="departStat">Departure Station</Label>
      <div class="relative w-full max-w-sm items-center">
        <Input
          id="departStat"
          type="text"
          placeholder=""
          v-model="departureStationName"
          disabled
        />
      </div>
    </div>
    <div class="grid gap-2">
      <Label for="arriveStat">Arrival Station</Label>
      <div class="relative w-full max-w-sm items-center">
        <Input
          id="arriveStat"
          type="text"
          placeholder=""
          v-model="arrivalStationName"
          disabled
        />
      </div>
    </div>
    <span v-if="errorMessage" class="text-red-500">{{ errorMessage }}</span>
    <SheetFooter class="mt-4">
      <Button type="submit" @click="saveTrainPlan" :disabled="isLoading">
        <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isLoading" />
        Save Train
      </Button>
    </SheetFooter>
  </div>
</template>
