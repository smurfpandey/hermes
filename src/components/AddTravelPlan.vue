<script setup>
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-vue-next';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon } from 'lucide-vue-next';
import { computed, h, ref } from 'vue';
import dayjs from 'dayjs';

import { fetchFlightSchedule } from '@/lib/amadeusClient';

const flightDoDCalendarOpen = ref(false);
const flightDoDValue = ref('');
const flightNum = ref('');
const airlineCode = ref('');
const isFlightLoading = ref(false);
const errorMessage = ref('');

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

    const flightInfo = await fetchFlightSchedule(
      airlineCode.value,
      flightNum.value,
      departureDate,
    );

    alert(flightInfo);

    // const response = await fetch(
    //   `http://api.aviationstack.com/v1/flights?access_key=${accessKey}&flight_iata=${flightNum.value}&flight_date=${departureDate}`,
    // );
    // if (!response.ok) {
    //   errorMessage.value =
    //     'Something went wrong when trying to fetch flight details!';
    // }
    // const data = await response.json();
    // flightDetail.value = data;
    // const departureCity = data.data[0]?.departure?.airport;
    // const arrivalCity = data.data[0]?.arrival?.airport;
    // console.log('Departure City:', departureCity);
    // console.log('Arrival City:', arrivalCity);
  } catch (error) {
    errorMessage.value =
      'Something went wrong when trying to fetch flight details!';
  } finally {
    isFlightLoading.value = false;
  }
};
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="outline"> + Add Travel </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Add Travel</SheetTitle>
        <SheetDescription>
          Add new travel plan here. Click save when you're done.
        </SheetDescription>
      </SheetHeader>
      <Tabs default-value="flight" class="my-2">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="flight"> Flight </TabsTrigger>
          <TabsTrigger value="train"> Train </TabsTrigger>
        </TabsList>
        <TabsContent value="flight" class="mt-4">
          <form class="space-y-8" @submit="onSubmit">
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
                      flightDoDValue
                        ? getDisplayDate(flightDoDValue)
                        : 'Pick a date'
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
                    v-model="airlineCode"
                    @focusout="fetchFlightDetail"
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
                    <Loader2
                      class="w-4 h-4 mr-2 animate-spin"
                      v-if="isFlightLoading"
                    />
                  </span>
                </div>
              </div>
            </div>
            <span v-if="errorMessage" class="text-red-500">{{
              errorMessage
            }}</span>
            <SheetFooter class="mt-4">
              <SheetClose as-child>
                <Button type="submit"> Save Flight </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </TabsContent>
        <TabsContent value="train">
          <SheetFooter>
            <SheetClose as-child>
              <Button type="submit"> Save Train </Button>
            </SheetClose>
          </SheetFooter>
        </TabsContent>
      </Tabs>
    </SheetContent>
  </Sheet>
</template>
