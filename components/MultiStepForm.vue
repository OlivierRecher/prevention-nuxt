<script setup>
import useDetectKeyboardOpen from "use-detect-keyboard-open";

const isKeyboardOpen = useDetectKeyboardOpen();
const step = ref(1)
const formData = ref({
  mealState: 34,
  gender: null,
  weight: undefined,
  alcohol: null,
})
const genderList = ref(['Homme', 'Femme', 'Autre']);

onMounted(() => {
  window.addEventListener('resize', checkKeyboard)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkKeyboard)
})

const nextStep = () => {
  step.value++;
}

const resetForm = () => {
  step.value = 1;
}

const checkKeyboard = () => {
  isKeyboardOpen.value = window.innerHeight < window.screen.height * 0.7
}
</script>

<template>
  <div class="absolute left-0 p-4">
    <UButton
      icon="i-lucide-refresh-cw"
      label="Réinitialiser"
      size="xl"
      color="warning"
      variant="link"
      @click="resetForm"
    />
  </div>
  <div class="flex justify-center items-center text-center h-screen">

    <div v-if="step === 1">
      <h2 class="text-5xl font-bold">Bienvenue</h2>
    </div>

    <div v-if="step === 2">
      <h2 class="text-3xl font-bold mb-10">Comment évaluerais-tu la qualité de ton repas ?</h2>
      <div class="px-10">
        <USlider
        v-model="formData.mealState"
        color="warning"
        step="34"
        :default-value="34"
      />
      </div>
    </div>

    <div v-if="step === 3">
      <h2 class="text-3xl font-bold mb-10">Comment te définis-tu ?</h2>
       <USelect
        v-model="formData.gender"
        size="xl"
        :items="genderList"
        class="w-60"
       />
    </div>

    <div v-if="step === 4">
      <h2>Quel est ton poids ?</h2>
      <UInputNumber
        v-model="formData.weight"
        placeholder="Poids en kg"
        orientation="vertical"
        min="1"
        max="500"
      />
    </div>

    <div v-if="step === 5">
      <AlcoholLevelCalculator />
    </div>
    {{ isKeyboardOpen ? "open" : "close" }}
    <UButton
      :label="step === 1 ? 'Démarrer' : 'Suivant'"
      trailing-icon="i-lucide-arrow-right"
      size="xl"
      color="warning"
      variant="solid"
      :class="['absolute px-20', isKeyboardOpen ? 'bottom-60' : 'bottom-10']"
      :disabled="
        (step === 3 && !formData.gender) || 
        (step === 4 && !formData.weight)
      "
      @click="nextStep"
    />
  </div>
</template>