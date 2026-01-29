declare global {
  type service = {
    service_name: string;
    service_description: string;
    service_price: string;
    service_tax: string;
  };

  type order_form = string;
  type term_of_service = string;

  type total_amount = number;
}

export {};
