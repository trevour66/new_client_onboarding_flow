<script setup lang="ts">
definePageMeta({
  layout: "onboarder",
});
</script>

<template>
  <div
    tabindex="-1"
    class="flex justify-center items-center w-[100vw] md:inset-0 h-[100vh] max-h-full"
  >
    <div class="relative p-4 w-full max-w-md max-h-full">
      <div
        class="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6"
      >
        <div class="p-4 md:p-5 text-center">
          <svg
            class="mx-auto mb-4 text-green-600 w-12 h-12"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <h3 class="mb-6 text-body">Document successfully signed</h3>
        </div>
      </div>
    </div>
  </div>
</template>
