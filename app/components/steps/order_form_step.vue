<script setup lang="ts">
const order_form = ref(useOnboarderStore().get_order_form);
</script>

<template>
  <div class="min-h-full w-full flex justify-center">
    <!-- {{ order_form }} -->
    <section class="order-content min-h-full" v-html="order_form"></section>
  </div>
</template>

<style>
.order-content {
  line-height: 1.7;
  font-size: 15px;
  color: #1f2937;
  max-width: 760px;
}

/* Headings */
.order-content h1,
.order-content h2,
.order-content h3,
.order-content h4 {
  font-size: 22px;
  font-weight: 700;
  margin-top: 28px;
  margin-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 6px;
}

/* Paragraphs */
.order-content p {
  margin: 12px 0;
}

/* Lists */
.order-content ul {
  margin: 10px 0 16px 0;
  padding-left: 22px;
}

.order-content li {
  margin: 6px 0;
}

/* Strong text */
.order-content strong {
  font-weight: 600;
  color: #111827;
}

/* Emphasis */
.order-content em {
  color: #4b5563;
}

/* Example blocks */
.order-content p em {
  display: block;
  margin-top: 8px;
}

/* Section spacing */
.order-content h2 + ul,
.order-content h2 + p {
  margin-top: 8px;
}

/* Improve readability for money values */
.order-content strong {
  letter-spacing: 0.2px;
}

/* Optional: subtle card look */
.order-content {
  background: #ffffff;
  padding: 24px 28px;
}
</style>
