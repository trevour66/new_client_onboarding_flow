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
      customer_id: "cus_TshTyVwtLbFBdt",
    },
  });

  if (!res) return;

  clientSecret.value = res.setupIntentClientSecret;
};

const prepare_payment = async (payment_method_to_be_used: string) => {
  if (!stripe) return;
  const res = await $fetch("/api/stripe/create-subscription", {
    method: "POST",
    body: {
      priceId: "price_1Suraz1CAJ2s4WZl5BjXPdaN",
      customer_id: "cus_TshTyVwtLbFBdt",
      payment_method: payment_method_to_be_used,
    },
  });

  console.log("SUBSCRIPTION RESPONSE: ", res);
};

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

  const appearance = {
    theme: "flat", // or 'stripe', 'night'
    variables: {
      colorPrimary: "#188bf6",
      colorBackground: "#ffffff",
      colorText: "#1a202c",
      colorDanger: "#e93d3d",
      borderRadius: "10px",
      fontFamily: "Inter, system-ui, sans-serif",
      spacingUnit: "4px",
    },
    rules: {
      ".Input": {
        border: "1px solid #cbd5e0",
        boxShadow: "none",
        padding: "12px",
      },
      ".Input:focus": {
        border: "1px solid #188bf6",
      },
      ".Label": {
        fontWeight: "600",
      },
      ".Tab": {
        borderRadius: "8px",
      },
    },
  };

  // Pass the appearance object to the Elements instance
  const elements = stripe.elements({
    clientSecret: clientSecret_local,
  });

  /* ---------------- CARD ---------------- */
  // PAYMENT REQUEST BUTTON
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

  const setup = result?.setupIntent ?? false;
  const error = result?.error ?? false;

  if (error) return;

  const payment_method = result.setupIntent?.payment_method ?? false;

  if (!payment_method) return;

  console.log(result.setupIntent?.payment_method);

  if (typeof payment_method === "string") {
    await prepare_payment(payment_method);
  } else {
    await prepare_payment(payment_method.id);
  }
};
</script>

<template>
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

<style></style>
