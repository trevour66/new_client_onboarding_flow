import { createClient } from "@supabase/supabase-js";
import {
  type ProposalRow,
  type ProposalResponse,
} from "../../../types/proposal";

export default defineEventHandler(async (event) => {
  try {
    const proposalId = getRouterParam(event, "proposal_id");

    if (!proposalId) {
      throw createError({
        statusCode: 400,
        message: "Missing proposal ID",
      });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
    );

    const { data, error } = await supabase
      .from("new_billing_proposals")
      .select(
        `
            proposal_id,
            template_id,
            stripe_customer_id,
            stripe_price_id,
            order_form_html,
            services,
            status
          `,
      )
      .eq("proposal_id", proposalId)
      .single();

    if (error || !data) {
      throw createError({
        statusCode: 404,
        message: "Proposal not found",
      });
    }

    const proposal: ProposalRow = data;

    console.log(proposal);

    // Shape response for frontend composable
    return {
      ok: true,
      proposal: {
        template_id: proposal.template_id,
        stripe_customer_id: proposal.stripe_customer_id,
        stripe_price_id: proposal.stripe_price_id,
        order_form: proposal.order_form_html,
        service: proposal.services,
        status: proposal.status,
      },
    } as ProposalResponse;
  } catch (error) {
    console.log("ERROR----------");
    console.log(error);
    return {
      ok: false,
      proposal: {
        template_id: "",
        stripe_customer_id: "",
        stripe_price_id: "",
        order_form: "",
        service: [],
        status: "",
      },
    } as ProposalResponse;
  }
});
