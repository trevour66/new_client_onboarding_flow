import { createClient } from "@supabase/supabase-js";
import { type ProposalConfig } from "../../../types/proposal";
import { v4 as uuidv4 } from "uuid";

export default defineEventHandler(async (event) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  );

  const body = await readBody<ProposalConfig>(event);

  // ----- Validate input -----
  const requiredFields = [
    "template_id",
    "stripe_customer_id",
    "stripe_price_id",
    "order_form",
    "service",
  ];
  for (const field of requiredFields) {
    if (!body[field as keyof ProposalConfig]) {
      throw createError({
        statusCode: 400,
        message: `Missing required field: ${field}`,
      });
    }
  }

  if (!Array.isArray(body.service) || body.service.length === 0) {
    throw createError({
      statusCode: 400,
      message: "Service array must contain at least one item",
    });
  }

  // Validate service items
  body.service.forEach((s, i) => {
    const serviceFields = [
      "service_name",
      "service_base_price",
      "service_tax",
      "credit_card_charge",
    ];
    for (const f of serviceFields) {
      if (!(f in s)) {
        throw createError({
          statusCode: 400,
          message: `Service item ${i} missing required field: ${f}`,
        });
      }
    }
  });

  // ----- Generate unique proposal ID -----
  const proposalId = uuidv4();

  // ----- Insert into Supabase -----
  const { data, error } = await supabase
    .from("new_billing_proposals")
    .insert({
      proposal_id: proposalId,
      template_id: body.template_id,
      stripe_customer_id: body.stripe_customer_id,
      stripe_price_id: body.stripe_price_id,
      order_form_html: body.order_form,
      services: body.service,
      status: "draft",
    })
    .select()
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }

  return {
    ok: true,
    proposal_id: data.proposal_id,
  };
});
