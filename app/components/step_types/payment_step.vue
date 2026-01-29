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
      customer_id: "cus_TsfpJb7joNtvcK",
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
      customer_id: "cus_TsfpJb7joNtvcK",
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

/*
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
*/

onMounted(async () => {
  await prepare_setup_intent();

  if (!stripe) return;

  const clientSecret_local = clientSecret?.value ?? false;

  if (!clientSecret_local) return;

  const elements = stripe.elements();

  console.log("here");

  /* ---------------- CARD ---------------- */
  // PAYMENT REQUEST BUTTON
  const paymentRequest = stripe.paymentRequest({
    country: "AU",
    currency: "aud",
    total: { label: "Verify Card", amount: 100 },
    requestPayerName: true,
    requestPayerEmail: true,
  });

  const prButton = elements.create("paymentRequestButton", {
    paymentRequest: paymentRequest,
    style: { paymentRequestButton: { type: "default", theme: "light" } },
  });

  paymentRequest.canMakePayment().then((result) => {
    if (result) {
      prButton.mount("#payment-request-button");
    } else {
    }
  });

  console.log("here 2");

  card = elements.create("card", {
    style: { base: { fontFamily: "Poppins", fontSize: "16px" } },
  });
  card.mount("#card-element");

  // Handle available auto payment method
  paymentRequest.on("paymentmethod", async (event) => {
    console.log("paymentmethod");

    console.log("Payment Request event:", event);
    const { setupIntent, error } = await stripe.confirmCardSetup(
      clientSecret_local,
      {
        payment_method: event.paymentMethod.id,
      },
      {
        handleActions: false,
      },
    );

    if (error) {
      event.complete("fail");
      console.log(error);
      return;
    }

    event.complete("success");

    if (setupIntent.status === "requires_action") {
      const { error: actionError } =
        await stripe.confirmCardSetup(clientSecret_local);

      if (actionError) {
        console.log(actionError);
        return;
      }
    }
  });
  // End

  console.log("here 3");

  /* ---------------- BANK ---------------- */
  const auBankAccount = elements.create("auBankAccount");
  auBankAccount.mount("#au-bank-account-element");

  auBankAccount.on("change", function (event) {
    const bankName = document.getElementById("bank-name");
    if (!bankName) return;
    if (event.bankName && event.branchName) {
      bankName.textContent = `${event.bankName} (${event.branchName})`;
      bankName.classList.add("visible");
    } else if (event.bankName) {
      bankName.textContent = `${event.bankName}`;
      bankName.classList.add("visible");
    } else {
      bankName.classList.remove("visible");
    }
  });
});

// Manual form submission
// const submitPayment = async () => {
//   if (!stripe) return;
//   if (!clientSecret.value) return;

//   const { setupIntent, error } = await stripe.confirmCardSetup(
//     clientSecret.value,
//     {
//       payment_method: {
//         card,
//       },
//     },
//   );

//   if (error) {
//     return;
//   }
// };

const submitPayment = async () => {
  if (!stripe) return;

  console.log("here22");
  const clientSecret_local = clientSecret?.value ?? false;

  if (!clientSecret_local) return;

  console.log("here23");

  const result = await stripe.confirmCardSetup(clientSecret_local, {
    payment_method: {
      card,
      billing_details: { email: "peteriniubong@gmail.com" },
    },
  });

  console.log(result);
};
</script>

<template>
  here {{ clientSecret }}

  <br />
  <br />
  <br />

  <div id="card-section" class="method-section active">
    <div id="payment-request-button"></div>
    <label>Card Details *</label>
    <div id="card-element"></div>
  </div>

  <!-- BANK -->
  <div id="bank-section" class="method-section">
    <label>Bank account</label>
    <div id="au-bank-account-element"></div>

    <div id="bank-name"></div>
  </div>

  <Button class="w-full" @click="submitPayment"> Subscribe </Button>
</template>
