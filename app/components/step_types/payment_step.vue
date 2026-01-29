<script setup lang="ts">
import { loadStripe } from "@stripe/stripe-js";

const stripe = await loadStripe(
  "pk_test_51RqkA41CAJ2s4WZlPS0cd1lxYC128w2FRzCKA2gFnSPs2P7kg8hhjM0Ooph9FzrlyfNHc19tQAFJ4Ttpp00VnKqQ005b2WL2y5",
);

const clientSecret = ref<string | null>(null);
const elements = ref<any>(null);

const prepare_setup_intent = async () => {
  if (!stripe) return;
  const res = await $fetch("/api/stripe/create-setup-intent", {
    method: "POST",
    body: {
      userId: "cus_TsfpJb7joNtvcK",
    },
  });

  if (!res) return;

  clientSecret.value = res.setupIntentClientSecret;

  // console.log("SUBSCRIPTION RESPONSE: ", res);

  // clientSecret.value =
  //   "pi_3SurrK1CAJ2s4WZl192MDFk7_secret_jIkCTDC9k25Qo4aAr0fFJE4NH";

  // elements.value = stripe.elements({
  //   clientSecret: clientSecret.value,
  // });

  // const paymentElement = elements.value.create("payment");
  // paymentElement.mount("#payment-element");
};

const prepare_payment = async () => {
  if (!stripe) return;
  const res = await $fetch("/api/stripe/create-subscription", {
    method: "POST",
    body: {
      priceId: "price_1Suraz1CAJ2s4WZl5BjXPdaN",
      userId: "cus_TsfpJb7joNtvcK",
    },
  });

  // console.log("SUBSCRIPTION RESPONSE: ", res);

  // clientSecret.value =
  //   "pi_3SurrK1CAJ2s4WZl192MDFk7_secret_jIkCTDC9k25Qo4aAr0fFJE4NH";

  // elements.value = stripe.elements({
  //   clientSecret: clientSecret.value,
  // });

  // const paymentElement = elements.value.create("payment");
  // paymentElement.mount("#payment-element");
};

// Refs
const first = ref("");
const last = ref("");
const email = ref("");
const submitButton = ref(null);
const msg = ref(null);
let card: any = null;

onMounted(async () => {
  await prepare_setup_intent();

  if (!stripe) return;
  if (!clientSecret.value) return;

  const elements = stripe.elements();

  // Mount card element for manual entry
  card = elements.create("card");
  card.mount("#payment-element");

  // ---- PAYMENT REQUEST BUTTON ----
  const paymentRequest = stripe.paymentRequest({
    country: "AU",
    currency: "aud",
    total: { label: "Verify Card", amount: 0 },
    requestPayerName: true,
    requestPayerEmail: true,
  });

  const prButton = elements.create("paymentRequestButton", {
    paymentRequest: paymentRequest,
    style: { paymentRequestButton: { type: "default", theme: "light" } },
  });

  paymentRequest.canMakePayment().then((result) => {
    const container = document.getElementById("payment-request-button");
    if (result) {
      prButton.mount("#payment-request-button");
    }
  });

  // Handle auto payment methods (Apple Pay / Google Pay)
  paymentRequest.on("paymentmethod", async (event) => {
    if (!clientSecret.value) return;

    const { setupIntent, error } = await stripe.confirmCardSetup(
      clientSecret.value,
      {
        payment_method: event.paymentMethod.id,
      },
      {
        handleActions: false,
      },
    );

    if (error) {
      event.complete("fail");
      return;
    }

    event.complete("success");

    if (setupIntent.status === "requires_action") {
      const { error: actionError } = await stripe.confirmCardSetup(
        clientSecret.value,
      );
      if (actionError) {
        return;
      }
    }
  });
});

// Manual form submission
const submitPayment = async () => {
  if (!stripe) return;
  if (!clientSecret.value) return;

  const { setupIntent, error } = await stripe.confirmCardSetup(
    clientSecret.value,
    {
      payment_method: {
        card,
      },
    },
  );

  if (error) {
    return;
  }
};
</script>

<template>
  {{ clientSecret }}
  <div>
    <!-- Payment Request Button -->
    <div id="payment-request-button"></div>

    <!-- Manual Card Form -->
    <form id="verify-form" @submit.prevent="">
      <div id="card-element"><!-- Stripe Card Element will mount here --></div>
      <input v-model="first" placeholder="First Name" required />
      <input v-model="last" placeholder="Last Name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <button ref="submitButton" type="submit">Verify Card</button>
      <p ref="msg"></p>
    </form>

    <!-- Success Screen -->
    <div id="success-screen" style="display: none">
      <h3>Verification Successful!</h3>
    </div>
  </div>

  <Card>
    <CardHeader>
      <CardTitle>Subscribe</CardTitle>
      <CardDescription>Secure payment</CardDescription>
    </CardHeader>

    <CardContent>
      <div id="payment-element" />
    </CardContent>

    <CardFooter>
      <Button class="w-full" @click="submitPayment"> Subscribe </Button>
    </CardFooter>
  </Card>
</template>
