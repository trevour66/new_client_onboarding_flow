import "dotenv/config";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { customer_id, priceId, payment_method } = body;

  // 1. Fetch customer
  const customer = await stripe.customers.retrieve(customer_id);

  // 2. Create subscription
  const subscription = await stripe.subscriptions.create({
    collection_method: "charge_automatically",
    payment_behavior: "default_incomplete",

    customer: customer.id,
    items: [{ price: priceId }],
    payment_settings: {
      save_default_payment_method: "on_subscription",
    },
  });

  const latestInvoice = subscription.latest_invoice;

  if (!latestInvoice) {
    throw new Error("Invoice missing");
  }

  const invoiceId =
    typeof subscription.latest_invoice === "string"
      ? subscription.latest_invoice
      : subscription.latest_invoice?.id;

  if (!invoiceId) {
    throw new Error("Invoice not created");
  }

  const paidInvoice = await stripe.invoices.pay(invoiceId, {
    payment_method,
    expand: ["payment_intent"],
  });

  console.log("LATEST INVOICE: ", paidInvoice);

  return;
});
