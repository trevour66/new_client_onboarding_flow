export const useOnboarderStore = defineStore("onboarderStore", () => {
  const template_id = ref<string>("");
  const stripe_customer_id = ref<string>("");
  const stripe_price_id = ref<string>("");
  const order_form = ref<string>("");
  const services = ref<service[]>([]);

  const get_template_id = computed(() => {
    return template_id.value;
  });

  const get_order_form = computed(() => {
    return order_form.value;
  });

  const get_payment_data = computed(() => {
    return {
      stripe_customer_id: stripe_customer_id.value,
      stripe_price_id: stripe_price_id.value,
    };
  });

  const get_services = computed(() => {
    return services.value;
  });

  const set_template_id = (temp_id: string) => {
    template_id.value = temp_id;
  };

  const set_stripe_customer_id = (cus_stripe_id: string) => {
    stripe_customer_id.value = cus_stripe_id;
  };

  const set_stripe_price_id = (cus_price_id: string) => {
    stripe_price_id.value = cus_price_id;
  };

  const set_order_form = (order_form_content: string) => {
    order_form.value = order_form_content;
  };

  const add_service = (service: service) => {
    services.value.push(service);
  };

  return {
    get_template_id,
    get_order_form,
    get_payment_data,
    get_services,
    set_template_id,
    set_stripe_customer_id,
    set_stripe_price_id,
    set_order_form,
    add_service,
  };
});
