<script setup>
const alcoholLevel = ref(0);
const potentialAlcoholEliminationByVomiting = ref(0);
const timeStartDrinking = ref(null);
const timeBeforeSober = ref(0);
const timeBeforeDriving = ref(0);
const consumptionHistory = ref([]);
const hasDrawerOpened = ref(false);

let intervalID = null;

const props = defineProps({
  timeAssimilation: Number,
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

const calculateVomitingElimination = () => {
  hasDrawerOpened.value = true;
  const now = new Date();
  const potentialAlcoholAmountEliminable = consumptionHistory.value.filter((consumption) => {
    return (now - consumption.time) / (1000 * 60) <= props.timeAssimilation;
  }).reduce((sum, consumption) => sum + consumption.amount, 0);

  potentialAlcoholEliminationByVomiting.value = parseFloat((potentialAlcoholAmountEliminable / (props.weight * (props.gender === "Homme" ? 0.68 : props.gender === "Femme" ? 0.55 : (0.68 + 0.55) / 2))).toFixed(2));
}

const EliminationByVomiting = () => {
  const now = new Date();
  consumptionHistory.value = consumptionHistory.value.filter((consumption) => {
    return (now - consumption.time) / (1000 * 60) > props.timeAssimilation;
  });
  calculateBloodAlcoholLevel();
  calculateTime();
  potentialAlcoholEliminationByVomiting.value = 0;
}

watch(alcoholLevel, (newVal) => {
  if (newVal > 0 && !intervalID) {
    intervalID = setInterval(decreaseAlcoholLevel, 6 * 60 * 1000);
  }
});
</script>

<template>
  <div class="flex flex-col justify-between items-center h-screen">
    <div class="flex flex-col justify-center items-center text-center h-screen">
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
    </div>
    <div class="absolute bottom-10">
      <UDrawer
        @update:open="calculateVomitingElimination"
      >
        <UChip
          :show="!hasDrawerOpened && !timeStartDrinking"
          size="2xl"
        >
          <span v-if="!hasDrawerOpened" class="inline-flex h-full w-full animate-ping rounded-lg bg-green-400 opacity-25" />
          <UButton
          label="Vomir pour repartir"
          size="xl"
          color="primary"
          variant="solid"
          class="px-22"
        />
        </UChip>

        <template #body>
          <div class="h-48 justify-center text-center">
            <p class="text-start">Vomir maintenant peut vous permettre d'éliminer une partie de l'alcool pas encore assimilé dans le sang depuis les {{ timeAssimilation }} dernières minutes, soit:</p>
            <div class="w-full text-3xl font-bold py-4">{{ potentialAlcoholEliminationByVomiting }} g/L</div>
             <UButton
                label="Vomir"
                size="xl"
                color="primary"
                variant="solid"
                class="px-20"
                @click="EliminationByVomiting"
              />
          </div>
        </template>
      </UDrawer>
      <div class="flex flex-row justify-between my-4">
      
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