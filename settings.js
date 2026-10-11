
export const STORES = [
  { id: "107", name: "Třebíč" },
  { id: "145", name: "Žďár nad Sázavou" },
  { id: "148", name: "Pelhřimov" },
  { id: "191", name: "Znojmo" },
  { id: "199", name: "Dačice" },
  { id: "222", name: "Jihlava Tesco" },
  { id: "230", name: "Jihlava Aventin" },
  { id: "249", name: "Moravské Budějovice" },
  { id: "250", name: "Jihlava Staré Hory" },
  { id: "290", name: "Velká Bíteš" },
  { id: "296", name: "Humpolec" },
  { id: "308", name: "Velké Meziříčí" },
  { id: "310", name: "Havlíčkův Brod II" }
];

export const MONTHS = [
  "Leden", "Únor", "Březen", "Duben",
  "Květen", "Červen", "Červenec", "Srpen",
  "Září", "Říjen", "Listopad", "Prosinec"
];

export const FAMILY_TARGET = 0.03;

export function getStoreLabel(storeId) {
  const store = STORES.find(item => item.id === String(storeId));
  return store ? `CS${store.id} ${store.name}` : "";
}

export function createDefaultSettings(storeId, year, month) {
  return {
    storeId: String(storeId),
    year: Number(year),
    month: Number(month),

    monthlyPlan: null,
    lastYearRevenue: null,

    closedDays: [],

    shifts: {
      colors: ["#F5D98B", "#B9DCEB"],
      firstWeekLongShift: 1,
      overrides: {}
    },

    employees: [],

    dp: {
      name: "",
      target: null,
      unit: "ks"
    },

    secondDp: {
      name: "",
      target: null,
      unit: "ks"
    }
  };
}

