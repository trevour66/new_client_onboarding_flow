<script setup lang="ts">
const props = defineProps({
  current_step: {
    type: Number,
    required: true,
  },
});

const steps = ref([
  { step: 1, label: "Introduction" },
  { step: 2, label: "Service" },
  { step: 3, label: "Pricing details" },
  { step: 4, label: "Payment" },
  { step: 5, label: "Terms" },
]);
</script>

<template>
  <div class="hidden lg:flex flex-col items-start gap-y-2">
    <template v-for="(step, index) in steps" :key="index">
      <div
        class="flex items-center justify-between gap-x-[20px] hover:cursor-pointer"
      >
        <div
          :class="{
            'bg-black ': step.step < current_step,
            'border-black': step.step === current_step,
          }"
          class="min-w-[30px] h-[30px] flex items-center justify-center border rounded-full"
        >
          <span v-if="step.step < current_step">
            <IconsTick />
          </span>
          <span v-else>
            {{ step.step }}
          </span>
        </div>
        <div>
          <span
            :class="{
              'text-[#CDCDCD]': step.step !== current_step,
              'text-[black]': step.step === current_step,
            }"
            class="text-[16px] font-[600] uppercase"
            >{{ step.label }}</span
          >
        </div>
      </div>
      <div
        v-if="step.step < steps.length"
        class="min-w-[30px] flex items-center justify-center"
      >
        <div
          :class="{
            'bg-[#CDCDCD]': step.step >= current_step,
            'bg-[#000000]': step.step < current_step,
          }"
          class="h-[23px] w-[2px]"
        ></div>
      </div>
    </template>
  </div>

  <div class="w-full h-full flex lg:hidden justify-center items-center">
    <template v-for="(step, index) in steps" :key="index">
      <div
        :class="{
          'bg-black': step.step < current_step,
          'bg-white': step.step >= current_step,
          'border-black text-[black]': step.step === current_step,
          'text-[#CDCDCD]': step.step !== current_step,
        }"
        class="min-w-[30px] h-[30px] flex items-center justify-center border rounded-full"
      >
        <span v-if="step.step < current_step">
          <IconsTick />
        </span>
        <span v-else>
          {{ step.step }}
        </span>
      </div>
      <hr v-if="step.step < steps.length" class="min-w-[80px] border-[1.8px]" />
    </template>
  </div>
</template>
