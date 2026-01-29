import "dotenv/config";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default defineEventHandler(async (event) => {
  const { customer_id } = await readBody(event);

  // 1️⃣ Create a SetupIntent for the customer
  const setupIntent = await stripe.setupIntents.create({
    customer: customer_id,
    automatic_payment_methods: {
      enabled: true,
    },
    usage: "off_session",
  });

  console.log(setupIntent);

  // 2️⃣ Return client_secret for frontend
  return {
    setupIntentClientSecret: setupIntent.client_secret,
  };
});
