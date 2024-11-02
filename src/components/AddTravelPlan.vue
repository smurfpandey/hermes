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

const isOpen = ref(false);
</script>

<template>
  <Sheet v-model:open="isOpen">
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
          <AddFlightPlan :isParentSheetOpen="isOpen" />
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
