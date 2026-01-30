<script setup lang="ts">
import { useOnboarder } from "~/composable/useOnboarder";

definePageMeta({
  layout: "onboarder",
});

const route = useRoute();
const onboarder = useOnboarder();
const proposal_uid = route.params.uid;

const proposal_loading_error = ref("");
const proposal_loading = ref(true);

const fetch_proposal_data = async () => {
  if (typeof proposal_uid !== "string") {
    proposal_loading_error.value =
      "You tried to access a poorly formatted proposal link. Please request for another";
    return;
  }

  console.log(proposal_uid);

  const res = await onboarder.prepare_onboarding_data(proposal_uid);

  console.log(res);

  const order_form = res?.order_form ?? false;
  const stripe_customer_id = res?.stripe_customer_id ?? false;
  const stripe_price_id = res?.stripe_price_id ?? false;
  const template_id = res?.template_id ?? false;
  const services = res?.service ?? [];

  if (
    !order_form ||
    !stripe_customer_id ||
    !stripe_price_id ||
    !template_id ||
    services.length <= 0
  ) {
    return;
  }

  useOnboarderStore().set_order_form(order_form);
  useOnboarderStore().set_stripe_customer_id(stripe_customer_id);
  useOnboarderStore().set_stripe_price_id(stripe_price_id);
  useOnboarderStore().set_template_id(template_id);
  services.forEach((se) => {
    useOnboarderStore().add_service(se);
  });
};

onMounted(async () => {
  proposal_loading.value = true;
  await fetch_proposal_data();
  proposal_loading.value = false;
});
</script>

<template>
  <Onboarder v-if="!proposal_loading" />
</template>
