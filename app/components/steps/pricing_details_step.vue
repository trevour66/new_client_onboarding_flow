<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const services = ref(useOnboarderStore().get_services);

const format_currency = (amt: number) => {
  const format_amount = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amt);

  return format_amount;
};
</script>

<template>
  <div class="min-h-full w-full flex justify-center py-8">
    <section class="min-h-full w-[450px]">
      <Accordion type="single" class="w-full" default-value="item-1">
        <template v-for="(ser, index) in services">
          <AccordionItem :value="`item-1`">
            <AccordionTrigger>{{ ser.service_name }}</AccordionTrigger>
            <AccordionContent class="bg-gray-50 py-4">
              <div
                class="w-full flex flex-col justify-between items-center gap-2 px-3"
              >
                <div
                  v-if="ser.service_base_price"
                  class="w-full flex justify-between items-center"
                >
                  <span>Base Price</span>
                  <span class="font-[500]">{{
                    format_currency(ser.service_base_price)
                  }}</span>
                </div>
                <div
                  v-if="ser.service_tax"
                  class="w-full flex justify-between items-center"
                >
                  <span>GST Tax</span>
                  <span class="font-[500]">{{ ser.service_tax * 100 }}%</span>
                </div>
                <div
                  v-if="ser.credit_card_charge"
                  class="w-full flex justify-between items-center"
                >
                  <span>Credit Card Charge</span>
                  <span class="font-[500]"
                    >{{ ser.credit_card_charge * 100 }}%</span
                  >
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </template>
      </Accordion>
    </section>
  </div>
</template>
