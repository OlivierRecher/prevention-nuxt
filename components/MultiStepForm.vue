<script setup>
const step = ref(1)
const formData = ref({
  mealState: 34,
  gender: null,
  weight: undefined,
  alcohol: null,
})
const genderList = ref(['Homme', 'Femme', 'Autre']);
const buttonBottom = ref('2.5rem')

onMounted(() => {
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', adjustButtonPosition)
    window.visualViewport.addEventListener('scroll', adjustButtonPosition)
  }
})

onUnmounted(() => {
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', adjustButtonPosition)
    window.visualViewport.removeEventListener('scroll', adjustButtonPosition)
  }
})

const nextStep = () => {
  step.value++;
}

const resetForm = () => {
  step.value = 1;
}

const adjustButtonPosition = () => {
  if (window.visualViewport) {
    const viewportHeight = window.visualViewport.height
    const screenHeight = window.screen.height

    if (viewportHeight < screenHeight * 0.8) {
      const offset = screenHeight - viewportHeight
      buttonBottom.value = `${offset + 10}px`
    } else {
      buttonBottom.value = '2.5rem'
    }
  }
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
    <UButton
      :label="step === 1 ? 'Démarrer' : 'Suivant'"
      trailing-icon="i-lucide-arrow-right"
      size="xl"
      color="warning"
      variant="solid"
      class="absolute px-20"
      :style="{ bottom: buttonBottom }"
      :disabled="
        (step === 3 && !formData.gender) || 
        (step === 4 && !formData.weight)
      "
      @click="nextStep"
    />
  </div>
</template>