import axios from "axios";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const { placeholder_fields } = body;

  const secret_token = "1fa06b39-3b7b-48e5-8ac9-eb4f8ea49a03"; // store in runtime config

  const payload = {
    template_id: body.template_id,
    title: body.title,
    expires_in_hours: "48",
    test: "yes",
    signers: [
      {
        name: "Benny Bell",
        email: "peteriniubong@gmail.com",
        mobile: "+12481234567",
        company_name: "ACME Corp",
        signed_document_delivery_method: "email",
        redirect_url: "https://google.com",
      },
    ],
    placeholder_fields: placeholder_fields,
    custom_branding: {
      company_name: "WhiteLabel LLC",
      logo_url: "https://online-logo-store.com/yourclient-logo.png",
    },
  };

  try {
    const response = await axios.post(
      `https://esignatures.com/api/contracts?token=${secret_token}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    // console.log(JSON.stringify(response.data));

    const signer = response?.data?.data?.contract?.signers[0] ?? false;
    const sign_page_url = signer?.sign_page_url ?? false;

    if (!sign_page_url) {
      return;
    }

    console.log(`${sign_page_url}?embedded=yes&redirect_iframe=yes`);
    return `${sign_page_url}?embedded=yes&redirect_iframe=yes`;
  } catch (error: any) {
    console.error("eSignatures error:", error.response?.data || error.message);

    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: "Failed to create contract",
      data: error.response?.data,
    });
  }
});
