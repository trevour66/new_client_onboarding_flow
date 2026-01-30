<script setup lang="ts">
import Introduction_step from "../steps/introduction_step.vue";
import Order_form_step from "../steps/order_form_step.vue";
import Payment_step from "../steps/payment_step.vue";
import Pricing_details_step from "../steps/pricing_details_step.vue";
import Success_step from "../steps/success_step.vue";
import Terms_step from "../steps/terms_step.vue";

// const props = defineProps<{
//   client_details: ClientDetail | null;
// }>();

const emits = defineEmits(["form_submission_success"]);

const currentStep = ref<number>(1);
const error_submitting = ref<boolean>(false);
const submitting = ref<boolean>(false);

const steps_components = computed(() => {
  return [
    Introduction_step,
    Order_form_step,
    Pricing_details_step,
    Payment_step,
    Terms_step,
    Success_step,
  ];
});

const currentStepComponent = computed(() => {
  return steps_components.value[currentStep.value - 1];
});

const isLastStep = computed(() => {
  return currentStep.value === steps_components.value.length;
});

const gotoPrevStep = () => {
  currentStep.value = currentStep.value === 1 ? 1 : currentStep.value - 1;
  error_submitting.value = error_submitting.value ? false : false;
};

const gotoNextStep = async () => {
  error_submitting.value = error_submitting.value ? false : false;

  if (!validateCurrentStep.value) return;

  if (isLastStep.value) {
    // validate and submit form
    try {
      if (submitting.value) return;
      submitting.value = true;

      emits("form_submission_success");
    } catch (error) {
      console.log(error);
      error_submitting.value = true;
    }
  }

  currentStep.value = currentStep.value + 1;
};

const validateCurrentStep = computed(() => {
  let isValid = true;

  switch (currentStep.value) {
    case 1:
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:
      break;
    case 5:
      break;
    case 6:
      break;
  }

  return isValid;
});

onMounted(() => {});
</script>

<template>
  <section class="h-[100vh]">
    <div
      class="flex flex-col items-start justify-between py-[35px] px-[30px] gap-y-[25px] bg-white h-full"
    >
      <div
        class="flex flex-col lg:flex-row items-center justify-between w-full min-h-[10vh]"
      >
        <img src="assets/images/logo.webp" alt="" class="h-[60px]" />
        <div class="flex flex-col text-right">
          <span class="font-[600] uppercase text-gray-600"> Test Dental </span>
          <span class="font-[600] uppercase text-gray-600">
            peteriniubong@gmail.com
          </span>
        </div>
      </div>
      <hr class="h-px w-full bg-black/[0.3]" />
      <div class="w-full h-[85vh]">
        <div
          class="grid grid-cols-12 items-start justify-between px-[20px] divide-x gap-x-[20px] w-full h-full"
        >
          <div
            class="col-span-2 flex justify-start h-full max-h-[60vh] overflow-y-scroll pr-2"
          >
            <OnboarderMiscPartsStepProgress :current_step="currentStep" />
          </div>
          <div class="col-span-10 pl-[20px] h-full max-h-full">
            <div class="h-[60vh] overflow-y-scroll px-[10px]">
              <component
                :is="currentStepComponent"
                class="h-[60vh]"
              ></component>
            </div>

            <div class="w-full my-[30px] px-[10px]">
              <div
                :class="{
                  'justify-end': currentStep === 1,
                  'justify-between': currentStep !== 1,
                }"
                class="w-full flex"
              >
                <button
                  @click="gotoPrevStep()"
                  v-if="currentStep > 1"
                  class="px-[50px] py-[16px] rounded-[2px] flex items-center justify-center gap-[10px] text-black border-[1px]"
                >
                  <span class="text-[18px] font-[500]">Back</span>
                </button>
                <button
                  @click="gotoNextStep()"
                  :class="{
                    'opacity-[.5] hover:cursor-not-allowed':
                      !validateCurrentStep,
                  }"
                  :disabled="!validateCurrentStep || submitting"
                  class="px-[50px] py-[16px] rounded-[2px] bg-black flex items-center justify-center gap-[10px] text-white"
                >
                  <template v-if="submitting">
                    <IconsRefresh v-if="submitting" class="animate-spin" />
                  </template>
                  <span v-if="isLastStep">Submit</span>
                  <span v-else class="text-[18px] font-[500]">Continue</span>
                  <span>
                    <IconsArrowRightLeftWithLongerLegs />
                  </span>
                </button>
              </div>
              <p
                v-if="error_submitting"
                class="text-red-800 w-full text-center my-4"
              >
                We encontered an error while submittin this form please try
                again. Contact support if problem persist
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- For Mobile Screens --
  <div
    v-if="!is_not_mobile_screen"
    class="block flex flex-col gap-y-6 w-full h-full gap-y-[40px]"
  >
    <section class="px-[25px] lg:px-[50px]">
      <CreateCardMiscPartsStepProgress
        :current_step="currentStep"
      />
    </section>

    <component :is="currentStepComponent" :is_mobile="true"></component>

    <section
      class="px-[25px] lg:px-[50px] flex gap-[15px] pb-4 items-center overflow-x-auto mt-[80px]"
    >
      <div class="w-full flex justify-center">
        <button
          @click="gotoNextStep()"
          :class="{
            'opacity-[.5] hover:cursor-not-allowed': !validateCurrentStep,
          }"
          :disabled="!validateCurrentStep"
          class="w-full max-w-sm px-[50px] py-[16px] rounded-[2px] bg-black flex items-center justify-center gap-[10px] text-white"
        >
          <span v-if="isLastStep">Send Gift</span>
          <span v-else class="text-[18px] font-[500]">Continue</span>
          <span>
            <IconsArrowRightLeftWithLongerLegs />
          </span>
        </button>
      </div>
    </section>
  </div>
--></template>
