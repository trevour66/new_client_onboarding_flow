declare global {
  type service = {
    service_name: string;
    service_base_price: number;
    service_tax: number;
    credit_card_charge: number;
  };

  type total_amount = number;

  type ProposalConfig = {
    template_id: string;
    stripe_customer_id: string;
    stripe_price_id: string;
    order_form: string; // HTML string
    service: service[];
  };

  type ProposalRow = {
    proposal_id: string;
    template_id: string;
    stripe_customer_id: string;
    stripe_price_id: string;
    order_form_html: string;
    services: service[];
    status: string;
  };

  type ProposalResponse = {
    ok: boolean;
    proposal: ProposalConfig;
  };
}

export {};
