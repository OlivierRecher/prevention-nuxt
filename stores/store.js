const STORAGE_KEY = "userFormData";
const CONSUMPTIONHISTORY_KEY = "consumptionHistory";


function getFormData() {
  return localStorage.getItem(STORAGE_KEY);
}

function setFormData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearFormData() {
  localStorage.removeItem(STORAGE_KEY);
}

function getConsumptionHistory() {
  const raw = JSON.parse(localStorage.getItem(CONSUMPTIONHISTORY_KEY));
  const consumptionHistory = raw.map(item => ({
  ...item,
    time: new Date(item.time)
  }));
  return consumptionHistory;
}

function setConsumptionHistory(data) {
  localStorage.setItem(CONSUMPTIONHISTORY_KEY, JSON.stringify(data));
}

function clearConsumptionHistory() {
  localStorage.removeItem(CONSUMPTIONHISTORY_KEY);
}

export {
    getFormData,
    setFormData,
    clearFormData,
    getConsumptionHistory,
    setConsumptionHistory,
    clearConsumptionHistory
}