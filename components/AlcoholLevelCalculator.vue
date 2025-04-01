<script setup>
const alcoholLevel = ref(0);
const timeBeforeDriving = ref(0);
const consumptionHistory = ref([]);

const props = defineProps({
  mealState: Number,
  gender: String,
  weight: Number,
});

function addDrink (amount) {
  const now = new Date();
  consumptionHistory.value.push({
    time: now,
    amount: amount,
  });
  calculateBloodAlcoholLevel();
}

function calculateBloodAlcoholLevel() {
  alcoholLevel.value = 0;
  const r = props.gender === "Homme" ? 0.68 : props.gender === "Femme" ? 0.55 : (0.68 + 0.55) / 2;
  consumptionHistory.value.forEach((consumption) => {
    alcoholLevel.value += consumption.amount / (props.weight * r);
  });
  alcoholLevel.value = parseFloat(alcoholLevel.value.toFixed(2));
}
</script>

<template>
  <div class="flex flex-col justify-center items-center text-center">
    <h1 class="text-3xl font-bold">{{ alcoholLevel }} g/L d'alcool dans le sang</h1>
    <h2 class="text-3xl font-bold">Vous pouvez reprendre le volant{{ timeBeforeDriving === 0 ? '.' : ' dans ' + timeBeforeDriving + 'min.' }}</h2>
  
    <div class="absolute bottom-10">
      <div class="flex flex-row justify-between mb-4">
      <UButton
        label="1/3 vodka"
        size="md"
        color="warning"
        variant="outline"
        class="px-4"
        @click="addDrink(30)"
      />
      <UButton
        label="1/2 vodka"
        size="md"
        color="warning"
        variant="outline"
        class="px-4"
        @click="addDrink(40)"
      />
      <UButton
        label="3/4 vodka"
        size="md"
        color="warning"
        variant="outline"
        class="px-4"
        @click="addDrink(60)"
      />
    </div>
    <UButton
      label="Ajouter une dose bar"
      size="xl"
      color="warning"
      variant="solid"
      class="px-20"
      @click="addDrink(10)"
    />
    </div>
  </div>
</template>