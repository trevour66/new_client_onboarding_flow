<script setup lang="ts">
import { IframeResizer } from "@iframe-resizer/vue";

/**
 * 'iframeResize' is declared but its value is never read.ts(6133)
'"iframe-resizer"' has no exported member named 'iframeResize'. Did you mean 'iframeResizer'?ts(2724)
index.d.ts(361, 14): 'iframeResizer' is declared here.
 */
const signUrl = ref("");
const iframeRef = ref<HTMLIFrameElement | null>(null);

const get_template = async () => {
  const res = await $fetch("/api/create-contract", {
    method: "POST",
    body: {
      template_id: "77b3f86d-98a2-4b9b-b136-b6b57f39e2e1",
      title: "Loan Agreement",
      signers: [
        {
          name: "Sam Signer",
          email: "sam@tenants.com",
          mobile: "+12481234567",
        },
      ],
      placeholder_fields: [{ api_key: "preferred_term", value: "24 months" }],
      test: "yes",
    },
  });

  signUrl.value = res as string;
};

onMounted(async () => {
  await get_template();
});
</script>

<template>
  <ClientOnly>
    <section v-if="signUrl" class="h-[800px]">
      <iframe ref="iframeRef" :src="signUrl" class="w-full h-full border-0" />
    </section>
  </ClientOnly>
</template>
