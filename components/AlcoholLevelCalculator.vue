<script setup>
const alcoholLevel = ref(0);
const timeStartDrinking = ref(null);
const timeBeforeSober = ref(0);
const timeBeforeDriving = ref(0);
const consumptionHistory = ref([]);

let intervalID = null;

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
  if (timeStartDrinking.value === null) {
    timeStartDrinking.value = consumptionHistory.value[0].time;
  }
  calculateBloodAlcoholLevel();
  calculateTime();
}

function calculateBloodAlcoholLevel() {
  alcoholLevel.value = 0;
  const r = props.gender === "Homme" ? 0.68 : props.gender === "Femme" ? 0.55 : (0.68 + 0.55) / 2;
  consumptionHistory.value.forEach((consumption) => {
    alcoholLevel.value += consumption.amount / (props.weight * r);
  });
  alcoholLevel.value = parseFloat(alcoholLevel.value.toFixed(2));
}

// Chaque heure c'est -0,10g/L, soit -0,01g/L tout les 6min, soit -0,0025g/L tout les 1min30 
const decreaseAlcoholLevel = () => {
  if (alcoholLevel.value > 0) {
    alcoholLevel.value = parseFloat(Math.max(0, alcoholLevel.value - 0.01).toFixed(2));
    calculateTime();
    return;
  }
  clearInterval(intervalID);
  intervalID = null;
};

const calculateTime = () => {
  timeBeforeSober.value = (alcoholLevel.value / 0.01) * 6;
  timeBeforeDriving.value = timeBeforeSober.value > 300 ? timeBeforeSober.value - 300 : 0;
}

watch(alcoholLevel, (newVal) => {
  if (newVal > 0 && !intervalID) {
    intervalID = setInterval(decreaseAlcoholLevel, 6 * 60 * 1000);
  }
});
</script>

<template>
  <div class="flex flex-col justify-center items-center text-center">
    <h1 class="text-3xl font-bold">{{ alcoholLevel }} g/L d'alcool dans le sang</h1>
    <h2 class="text-3xl font-bold">
      Vous pouvez reprendre le volant
      <span v-if="timeBeforeDriving === 0">.</span>
      <span v-else>
      dans {{ Math.floor(timeBeforeDriving / 60) }}h{{ Math.floor(timeBeforeDriving % 60) }}min.
      </span>
    </h2>
    <h3 class="text-md font-light">Ce calculateur ne remplace pas un éthylotest.</h3>
    <h3 class="text-md font-light">Soyez prudent en conduisant.</h3>
  
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