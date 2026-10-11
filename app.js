
import {
  STORES,
  MONTHS,
  createDefaultSettings
} from "./settings.js";

import {
  loadMonth,
  saveMonth
} from "./storage.js";

const app = document.getElementById("app");
const today = new Date();

app.innerHTML = `
  <section class="settings-panel">
    <h2>Editace – nastavení měsíce</h2>

    <div class="settings-grid">
      <label>
        Prodejna
        <select id="store">
          ${STORES.map(store => `
            <option value="${store.id}">
              CS${store.id} ${store.name}
            </option>
          `).join("")}
        </select>
      </label>

      <label>
        Měsíc
        <select id="month">
          ${MONTHS.map((name, index) => `
            <option value="${index + 1}">
              ${name}
            </option>
          `).join("")}
        </select>
      </label>

      <label>
        Rok
        <input id="year" type="number"
          min="2025" max="2100"
          value="${today.getFullYear()}">
      </label>
    </div>

    <div class="settings-grid">
      <label>
        Měsíční plán (Kč)
<input id="monthlyPlan" type="text" inputmode="numeric" class="money-input">      </label>

      <label>
        Loňský obrat (Kč)
<input id="lastYearRevenue" type="text" inputmode="numeric" class="money-input">      </label>
    </div>

    <div class="settings-actions">
      <button id="saveSettings">Uložit nastavení</button>
      <span id="saveStatus" role="status"></span>
    </div>
  </section>
`;

const storeInput = document.getElementById("store");
const monthInput = document.getElementById("month");
const yearInput = document.getElementById("year");
const planInput = document.getElementById("monthlyPlan");
const lastYearInput = document.getElementById("lastYearRevenue");
const saveStatus = document.getElementById("saveStatus");

monthInput.value = String(today.getMonth() + 1);
storeInput.value = "249";

function getSelection() {
  return {
    storeId: storeInput.value,
    year: Number(yearInput.value),
    month: Number(monthInput.value)
  };
}

async function loadSettings() {
  const { storeId, year, month } = getSelection();

  if (!Number.isInteger(year) || year < 2025 || year > 2100) {
    return;
  }

  const data = await loadMonth(storeId, year, month);

 planInput.value = formatMoney(data?.settings?.monthlyPlan);
lastYearInput.value = formatMoney(data?.settings?.lastYearRevenue);
  saveStatus.textContent = "";
}

async function saveSettings() {
  const { storeId, year, month } = getSelection();

  if (!Number.isInteger(year) || year < 2025 || year > 2100) {
    saveStatus.textContent = "Zkontroluj rok.";
    return;
  }

  const existing = await loadMonth(storeId, year, month);

  const settings = existing?.settings ??
    createDefaultSettings(storeId, year, month);

  settings.monthlyPlan = parseMoney(planInput.value);
settings.lastYearRevenue = parseMoney(lastYearInput.value);

  await saveMonth(storeId, year, month, {
    ...existing,
    settings
  });

  saveStatus.textContent = "Nastavení uloženo ✓";
}

storeInput.addEventListener("change", loadSettings);
monthInput.addEventListener("change", loadSettings);
yearInput.addEventListener("change", loadSettings);

planInput.addEventListener("input", () => {
  saveStatus.textContent = "Neuložené změny";
});

lastYearInput.addEventListener("input", () => {
  saveStatus.textContent = "Neuložené změny";
});

document.getElementById("saveSettings")
  .addEventListener("click", saveSettings);

loadSettings();


function formatMoney(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  return Number(value).toLocaleString("cs-CZ", {
    maximumFractionDigits: 0
  });
}

function parseMoney(value) {
  const digits = value.replace(/\D/g, "");
  return digits === "" ? null : Number(digits);
}

function formatMoneyWhileTyping(input) {
  const oldPosition = input.selectionStart ?? input.value.length;
  const digitsBeforeCursor =
    input.value.slice(0, oldPosition).replace(/\D/g, "").length;

  const digits = input.value.replace(/\D/g, "");

  input.value = digits
    ? Number(digits).toLocaleString("cs-CZ")
    : "";

  if (digitsBeforeCursor === 0) {
    input.setSelectionRange(0, 0);
    return;
  }

  let position = 0;
  let count = 0;

  while (position < input.value.length && count < digitsBeforeCursor) {
    if (/\d/.test(input.value[position])) count++;
    position++;
  }

  input.setSelectionRange(position, position);
}

[planInput, lastYearInput].forEach(input => {
  input.addEventListener("input", () => {
    formatMoneyWhileTyping(input);
  });
});


