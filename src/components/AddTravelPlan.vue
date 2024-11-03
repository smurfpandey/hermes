<script setup>
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
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

import AddFlightPlan from '@/components/AddFlightPlan.vue';
import AddTrainPlan from '@/components/AddTrainPlan.vue';

const isSheetOpen = ref(false);
</script>

<template>
  <Sheet v-model:open="isSheetOpen">
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
          <AddFlightPlan v-model:isParentSheetOpen="isSheetOpen" />
        </TabsContent>
        <TabsContent value="train">
          <AddTrainPlan v-model:isParentSheetOpen="isSheetOpen" />
        </TabsContent>
      </Tabs>
    </SheetContent>
  </Sheet>
</template>
