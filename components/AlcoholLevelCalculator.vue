<script setup>
import { getConsumptionHistory, setConsumptionHistory } from '@/stores/store.js';

const alcoholLevel = ref(0);
const alcoholLevelPeak = ref(0);
const genderFactor = ref(0);
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

onMounted(() => {
  hasDrawerOpened.value = false;
  genderFactor.value = props.gender === "Homme" ? 0.68 : props.gender === "Femme" ? 0.55 : (0.68 + 0.55) / 2;
  const storedData = getConsumptionHistory();

  if (!storedData) return;
  consumptionHistory.value = storedData;

  if (consumptionHistory.value.length < 1) return;
  timeStartDrinking.value = consumptionHistory.value[0].time;
  calculateBloodAlcoholLevel();
  calculateTime();
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
  setConsumptionHistory(consumptionHistory.value);
  calculateBloodAlcoholLevel();
  calculateTime();
}

function calculateBloodAlcoholLevel() {
  alcoholLevel.value = 0;
  consumptionHistory.value.forEach((consumption) => {
    alcoholLevel.value += consumption.amount / (props.weight * genderFactor.value);
  });
  alcoholLevel.value = parseFloat(alcoholLevel.value.toFixed(2));
  alcoholLevelPeak.value = alcoholLevel.value;
}

// Chaque heure c'est -0,10g/L, soit -0,01g/L tout les 6min, soit -0,0025g/L tout les 1min30
// pas totalement ok car réduit bien tout les 6min par rapport au dernier verre mais ne prends pas en compte la réduction depuis le début
const decreaseAlcoholLevel = () => {
  if (alcoholLevel.value === 0 || !timeStartDrinking.value && !alcoholLevelPeak.value) {
    return;
  }

  const now = new Date();
  const lastTimeDrinking = consumptionHistory.value[consumptionHistory.value.length - 1].time;
  const elapsedTimeInMinutes = (now - new Date(lastTimeDrinking)) / (1000 * 60);
  const alcoholReduction = Math.floor(elapsedTimeInMinutes / 6) * 0.01; // Réduction de 0.01 g/L toutes les 6 minutes

  alcoholLevel.value = parseFloat(Math.max(0, alcoholLevelPeak.value - alcoholReduction).toFixed(2));
  calculateTime();

  if (alcoholLevel.value === 0) {
    clearInterval(intervalID);
    intervalID = null;
  }
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

  potentialAlcoholEliminationByVomiting.value = parseFloat((potentialAlcoholAmountEliminable / (props.weight * genderFactor.value)).toFixed(2));
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
    intervalID = setInterval(decreaseAlcoholLevel, 1000);
  }
});
</script>

<template>
  <div class="absolute top-20 left-0 text-md font-light w-full">
      <h3>Ce calculateur ne remplace pas un éthylotest.</h3>
      <h3>Soyez prudent en conduisant.</h3>
    </div>
  <div class="flex flex-col items-center">
    <div class="flex flex-col text-center">
      <h1 class="text-2xl font-bold">{{ alcoholLevel }} g/L d'alcool dans le sang.</h1>
      <h2 class="text-2xl font-bold">
        Vous pouvez reprendre le volant<span v-if="timeBeforeDriving === 0">.</span>
        <span v-else>
        dans {{ Math.floor(timeBeforeDriving / 60) }}h{{ Math.floor(timeBeforeDriving % 60) }}min.
        </span>
      </h2>
    </div>
    <div class="absolute bottom-12">
      <UDrawer
        @update:open="calculateVomitingElimination"
      >
        <UChip
          :show="!hasDrawerOpened"
          size="2xl"
        >
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
    <p class="text-sm font-extralight">25cl de bière = 12cl de vin = 3cl d'alcool fort</p>
    </div>
  </div>
</template>