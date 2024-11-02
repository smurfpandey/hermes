<script setup>
import { find } from 'lodash-es';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-vue-next';
import dayjs from 'dayjs';
import { defineProps, ref } from 'vue';

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
import { fetchFlightSchedule } from '@/lib/amadeusClient';
import { getAirportByIATA } from '@/lib/rapidAPIClient';
import { supabase } from '@/lib/supabaseClient';

const isLoading = ref(false);

const flightDoDCalendarOpen = ref(false);
const flightDoDValue = ref('');
const flightNum = ref('');
const airlineCode = ref('');
const isFlightLoading = ref(false);
const errorMessage = ref('');
const departureCityName = ref('');
const departureAirportCode = ref('');
const arrivalCityName = ref('');
const arrivalAirportCode = ref('');

const flightDepartDateTime = ref('');
const flightArriveDateTime = ref('');

const formattedDepartureTime = ref(''); // Only time part for the input box
const formattedArrivalTime = ref('');
const isNextDay = ref(false);

const props = defineProps({
  isParentSheetOpen: {
    required: true,
  },
});

const handleFlightDODCal = () => {
  flightDoDCalendarOpen.value = false;
};

const getDisplayDate = (calDate) => {
  let date = calDate.toString();
  return dayjs(date, 'YYYY-MM-DD').format('DD-MMM-YYYY');
};

const openFlightDoDCalendar = () => {
  flightDoDCalendarOpen.value = true;
};

const fetchFlightDetail = async () => {
  if (!airlineCode.value || !/^[a-zA-Z0-9]{2,3}$/.test(airlineCode.value)) {
    return;
  }
  if (!flightNum.value || !/^\d{2,4}$/.test(flightNum.value)) {
    return;
  }
  if (!flightDoDValue.value) {
    return;
  }

  isFlightLoading.value = true;
  try {
    let departureDate = flightDoDValue.value.toString();
    let carrierCode = airlineCode.value.toUpperCase();

    const flightInfo = await fetchFlightSchedule(
      carrierCode,
      flightNum.value,
      departureDate,
    );

    if (flightInfo && flightInfo.data && flightInfo.data.length === 0) {
      return;
    }

    const flightPoints = flightInfo.data[0]?.flightPoints;

    const departurePoint = find(flightPoints, (point) => {
      if (point.departure && !point.arrival) return true;
    });

    const arrivalPoint = find(flightPoints, (point) => {
      if (!point.departure && point.arrival) return true;
    });

    const departureLocation = await getAirportByIATA(departurePoint.iataCode);
    if (departureLocation && departureLocation.length > 0) {
      departureCityName.value = departureLocation[0].city;
      departureAirportCode.value = departurePoint.iataCode;
    }

    const departureTiming = find(departurePoint.departure.timings, (time) => {
      return time.qualifier === 'STD';
    });
    flightDepartDateTime.value = departureTiming.value;
    formattedDepartureTime.value = dayjs(
      departureTiming.value,
      'YYYY-MM-DDTHH:mm:ssZ',
    ).format('hh:mm A');

    const arrivalLocation = await getAirportByIATA(arrivalPoint.iataCode);
    if (arrivalLocation && arrivalLocation.length > 0) {
      arrivalCityName.value = arrivalLocation[0].city;
      arrivalAirportCode.value = arrivalPoint.iataCode;
    }

    const arrivalTime = find(arrivalPoint.arrival.timings, (time) => {
      return time.qualifier === 'STA';
    });
    flightArriveDateTime.value = arrivalTime.value;
    formattedArrivalTime.value = dayjs(
      arrivalTime.value,
      'YYYY-MM-DDTHH:mm:ssZ',
    ).format('hh:mm A');

    // check if flight is next day or same day
    const diffDays = dayjs(arrivalTime.value).diff(
      departureTiming.value,
      'day',
    );
    if (diffDays > 0) {
      isNextDay.value = true;
    }
    console.log(diffDays);
  } catch (error) {
    errorMessage.value =
      'Something went wrong when trying to fetch flight details!';
    throw error;
  } finally {
    isFlightLoading.value = false;
  }
};

const saveFlightPlan = async () => {
  isLoading.value = true;
  const travelPlan = {
    transport_type: 'FLIGHT',
    transport_carrier_code: airlineCode.value.toUpperCase(),
    transport_number: flightNum.value,
    departure_datetime: flightDepartDateTime.value,
    departure_location: {
      code: departureAirportCode.value,
      name: departureCityName.value,
    },
    arrival_datetime: flightArriveDateTime.value,
    arrival_location: {
      code: arrivalAirportCode.value,
      name: arrivalCityName.value,
    },
  };

  //validate all properties

  //submit to supabase
  const supaResp = await supabase
    .from('travel_plan')
    .insert([{ ...travelPlan }]);

  if (supaResp.error) {
    errorMessage = supaResp.error.message;
  } else {
    errorMessage = 'Value saved successfully';
    props.isParentSheetOpe.value = false;
  }
};
</script>
<template>
  <div class="space-y-8">
    <div class="grid gap-2">
      <Label for="flightDoD">Date of departure</Label>
      <Popover :open="flightDoDCalendarOpen">
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            :class="
              cn(
                'w-full ps-3 text-start font-normal',
                !flightDoDValue && 'text-muted-foreground',
              )
            "
            @click="openFlightDoDCalendar"
          >
            <span>{{
              flightDoDValue ? getDisplayDate(flightDoDValue) : 'Pick a date'
            }}</span>
            <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar
            v-model="flightDoDValue"
            calendar-label="Date of departure"
            initial-focus
            @update:model-value="handleFlightDODCal"
          />
        </PopoverContent>
      </Popover>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="col-span-1">
        <Label for="airlineCode">Airline Code</Label>
        <div class="relative w-full max-w-sm items-center">
          <Input
            id="airlineCode"
            type="text"
            placeholder="e.g. 6E"
            class="uppercase"
            v-model="airlineCode"
          />
        </div>
      </div>
      <div class="col-span-1">
        <Label for="flightNum">Flight Number</Label>
        <div class="relative w-full max-w-sm items-center">
          <Input
            id="flightNum"
            type="text"
            placeholder="e.g. 4598"
            v-model="flightNum"
            @focusout="fetchFlightDetail"
          />
          <span
            class="absolute end-0 inset-y-0 flex items-center justify-center px-2"
          >
            <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isFlightLoading" />
          </span>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="col-span-1">
        <Label for="departureCity">Departure City</Label>
        <div class="relative w-full max-w-sm items-center">
          <Input
            id="departureCity"
            type="text"
            placeholder="e.g. Mumbai"
            class="capitalize"
            v-model="departureCityName"
          />
        </div>
      </div>
      <div class="col-span-1">
        <Label for="arrivalCity">Arrival City</Label>
        <div class="relative w-full max-w-sm items-center">
          <Input
            id="arrivalCity"
            type="text"
            placeholder="e.g. Paris"
            class="capitalize"
            v-model="arrivalCityName"
          />
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="col-span-1">
        <Label for="departTime">Departure Time</Label>
        <div class="relative w-full max-w-sm items-center">
          <Input
            id="departTime"
            type="text"
            placeholder="e.g. 05:30 AM"
            class="capitalize"
            v-model="formattedDepartureTime"
          />
        </div>
      </div>
      <div class="col-span-1">
        <Label for="arrivalTime">Arrival Time</Label>
        <div class="relative w-full max-w-sm items-center">
          <Input
            id="arrivalTime"
            type="text"
            placeholder="e.g. 09:10 PM"
            class="capitalize"
            v-model="formattedArrivalTime"
          />
          <span class="text-xs" v-if="isNextDay">(Next day)</span>
        </div>
      </div>
    </div>
    <span v-if="errorMessage" class="text-red-500">{{ errorMessage }}</span>
    <SheetFooter class="mt-4">
      <Button type="submit" @click="saveFlightPlan" :disabled="isLoading">
        <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isLoading" />
        Save Flight
      </Button>
    </SheetFooter>
  </div>
</template>
