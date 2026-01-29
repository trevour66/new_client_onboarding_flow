import "dotenv/config";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, priceId } = body;

  // 1. Fetch customer
  const customer = await stripe.customers.retrieve(userId);

  // 2. Create subscription (INCOMPLETE)
  const subscription = await stripe.subscriptions.create({
    collection_method: "charge_automatically",
    payment_behavior: "default_incomplete",

    customer: customer.id,
    items: [{ price: priceId }],
    payment_settings: {
      save_default_payment_method: "on_subscription",
    },
    expand: ["latest_invoice.payment_intent"],
  });

  const latestInvoice = subscription.latest_invoice;

  if (!latestInvoice || typeof latestInvoice === "string") {
    throw new Error("Invoice missing");
  }

  //   console.log("LATEST INVOICE: ", latestInvoice);

  const invoiceId =
    typeof subscription.latest_invoice === "string"
      ? subscription.latest_invoice
      : subscription.latest_invoice?.id;

  if (!invoiceId) {
    throw new Error("Invoice not created");
  }

  const invoice = await stripe.invoices.retrieve(invoiceId);

  // 2️⃣ Create a PaymentIntent for that amount & customer
  const paymentIntent = await stripe.paymentIntents.create({
    amount: invoice.amount_due,
    currency: invoice.currency,
    customer: userId,
    metadata: {
      invoice_id: invoice.id,
      subscription_id: subscription.id as string,
    },
    automatic_payment_methods: { enabled: true },
    setup_future_usage: "off_session",
  });

  //   await stripe.invoices.update(invoice.id, {
  //     payment_intent: paymentIntent.id,
  //   });

  const paidInvoice = await stripe.invoices.pay(invoice.id, {
    expand: ["payment_intent"],
  });

  console.log("LATEST INVOICE: ", paidInvoice);
  console.log("LATEST paymentIntent: ", paymentIntent);

  //   const paymentIntent = subscription.latest_invoice
  //     ?.payment_intent as Stripe.PaymentIntent;

  //   console.log("SUBSCRIPTION CREATED: ", subscription.id);
  //   console.log("paymentIntent CREATED: ", paymentIntent);
  return;
});
