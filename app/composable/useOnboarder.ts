import axios from "axios";

export const useOnboarder = () => {
  const proposal = ref<ProposalConfig | null>(null);
  const error = ref<string | null>(null);

  const fetchProposal = async (proposalId: string): Promise<void> => {
    error.value = null;

    try {
      const response = await axios.get(`/api/proposals/${proposalId}`);

      const data = response.data;

      //   console.log(data);

      if (!data?.ok || !data?.proposal) {
        throw new Error("Failed to load proposal");
      }

      proposal.value = data.proposal;
    } catch (err: unknown) {
      console.log(err);

      if (axios.isAxiosError(err)) {
        error.value =
          err.response?.data?.message || err.message || "Request failed";
      } else if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "Failed to load proposal";
      }
    }
  };

  const prepare_onboarding_data = async (proposal_uid: string) => {
    await fetchProposal(proposal_uid);

    if (error.value) {
      console.log(error.value);
      return;
    }

    if (!(proposal.value ?? false)) {
      console.log(error.value);
      return;
    }

    return {
      template_id: proposal.value?.template_id,
      stripe_customer_id: proposal.value?.stripe_customer_id,
      stripe_price_id: proposal.value?.stripe_price_id,
      order_form: proposal.value?.order_form,
      service: proposal.value?.service,
    };
  };

  return {
    prepare_onboarding_data,
  };
};
