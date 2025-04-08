<script setup>
useHead({
  title: "Alcoolytics",
  htmlAttrs: {
    lang: "fr"
  },
  meta: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    }
  ]
});
</script>
<template>
  <div>
    <UApp>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
