<script setup>
import { getFormData, setFormData, clearFormData, clearConsumptionHistory } from '@/stores/store.js';

const step = ref(null)
const formData = ref({
  timeAssimilation: 15,
  gender: null,
  weight: undefined,
})
const genderList = ref(['Homme', 'Femme', 'Autre']);
const isKeyboardOpen = ref(false);

onMounted(() => {
  step.value = 1;
  loadStoredData();
  window.visualViewport?.addEventListener("resize", updateButtonPosition);
});

onUnmounted(() => {
  window.visualViewport?.removeEventListener("resize", updateButtonPosition);
});

const loadStoredData = () => {
  const storedData = getFormData();
  if (!storedData) return;
  formData.value = JSON.parse(storedData);
  step.value = 5;
  return;
};

const nextStep = () => {
  step.value++;
};

const resetForm = () => {
  clearFormData();
  clearConsumptionHistory();
  step.value = 1;
};

const updateButtonPosition = () => {
  if (window.visualViewport) {
    const viewportHeight = window.visualViewport.height;
    const windowHeight = window.innerHeight;
    
    isKeyboardOpen.value = viewportHeight < windowHeight;
  }
};

watch(formData, (newData) => {
  setFormData(newData);
}, { deep: true });
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
  <div class="flex flex-col justify-center items-center text-center h-screen">

    <div v-if="step === 1">
      <h2 class="text-5xl font-bold">Bienvenue</h2>
    </div>

    <div v-if="step === 2">
      <h2 class="text-3xl font-bold mb-10">Comment évaluerais-tu la qualité de ton repas ?</h2>
      <div class="px-10">
        <USlider
        v-model="formData.timeAssimilation"
        color="warning"
        step="15"
        max="45"
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
      <h2 class="text-3xl font-bold mb-10">Quel est ton poids ?</h2>
      <UInputNumber
        v-model="formData.weight"
        placeholder="Poids en kg"
        orientation="vertical"
        min="1"
        max="500"
        size="xl"
        class="w-60"
      />
    </div>

    <div v-if="step === 5">
      <AlcoholLevelCalculator
        :time-assimilation="formData.timeAssimilation + 15"
        :gender="formData.gender"
        :weight="formData.weight"
      />
    </div>
    <UButton
      v-if="step && step !== 5"
      :label="step === 1 ? 'Démarrer' : 'Suivant'"
      trailing-icon="i-lucide-arrow-right"
      size="xl"
      color="warning"
      variant="solid"
      :class="['px-20', isKeyboardOpen ? 'inline mt-4' : 'absolute bottom-10']"
      :disabled="
        (step === 3 && !formData.gender) || 
        (step === 4 && !formData.weight)
      "
      @click="nextStep"
    />
  </div>
</template>