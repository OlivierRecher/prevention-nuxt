<script setup>
const colorMode = useColorMode();
</script>

<template>
    <div>
        <div class="absolute p-4">
            <UButton
            v-if="colorMode.preference === 'dark'"
            icon="i-lucide-sun" 
            size="xl"
            color="primary"
            variant="solid"
            @click="colorMode.preference = 'light'"
        />
        <UButton
            v-else
            icon="i-lucide-moon" 
            size="xl"
            color="primary"
            variant="solid"
            @click="colorMode.preference = 'dark'"
        />
        </div>
        <main>
          <slot />
        </main>
    </div>
</template>