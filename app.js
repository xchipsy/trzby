
import {
  STORES,
  MONTHS,
  createDefaultSettings
} from "./settings.js";

import {
  loadMonth,
  saveMonth
} from "./storage.js";

import { renderCalendar } from "./calendar.js";

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
        <input
          id="year"
          type="number"
          min="2025"
          max="2100"
          value="${today.getFullYear()}"
        >
      </label>
    </div>

    <div class="settings-grid">
      <label>
        Měsíční plán (Kč)
        <input
          id="monthlyPlan"
          type="text"
          inputmode="numeric"
          class="money-input"
        >
      </label>

      <label>
        Loňský obrat (Kč)
        <input
          id="lastYearRevenue"
          type="text"
          inputmode="numeric"
          class="money-input"
        >
      </label>
    </div>

    <details class="calendar-section">
      <summary>
        Zavřené dny
        <span id="closedDaysSummary">(žádné)</span>
      </summary>

      <p class="calendar-help">
        Kliknutím označ dny, kdy je prodejna zavřená.
        Tyto dny nebudou zahrnuté do denního plánu tržeb.
      </p>

      <div id="closedDaysCalendar"></div>
    </details>

    <div class="settings-actions">
      <button id="saveSettings" type="button">
        Uložit nastavení
      </button>
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

let closedDays = [];
let selectionVersion = 0;

monthInput.value = String(today.getMonth() + 1);
storeInput.value = "249";

function getSelection() {
  return {
    storeId: storeInput.value,
    year: Number(yearInput.value),
    month: Number(monthInput.value)
  };
}

function validSelection(year, month) {
  return Number.isInteger(year) &&
    year >= 2025 &&
    year <= 2100 &&
    Number.isInteger(month) &&
    month >= 1 &&
    month <= 12;
}

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

  const digitsBeforeCursor = input.value
    .slice(0, oldPosition)
    .replace(/\D/g, "").length;

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

  while (
    position < input.value.length &&
    count < digitsBeforeCursor
  ) {
    if (/\d/.test(input.value[position])) {
      count++;
    }
    position++;
  }

  input.setSelectionRange(position, position);
}

function markUnsaved() {
  saveStatus.textContent = "Neuložené změny";
}

function updateCalendarSummary() {
  const summary = document.getElementById("closedDaysSummary");

  summary.textContent = closedDays.length
    ? `(${closedDays.length} dní)`
    : "(žádné)";
}

function updateCalendar() {
  const { year, month } = getSelection();

  updateCalendarSummary();

  const container = document.getElementById("closedDaysCalendar");

  if (!validSelection(year, month)) {
    container.replaceChildren();
    return;
  }

  renderCalendar(
    container,
    year,
    month,
    closedDays,
    days => {
      closedDays = days;
      updateCalendarSummary();
      markUnsaved();
    }
  );
}

async function loadSettings() {
  const version = ++selectionVersion;
  const { storeId, year, month } = getSelection();

  if (!validSelection(year, month)) {
    planInput.value = "";
    lastYearInput.value = "";
    closedDays = [];
    updateCalendar();
    saveStatus.textContent = "Zkontroluj rok a měsíc.";
    return;
  }

  try {
    const data = await loadMonth(storeId, year, month);

    if (version !== selectionVersion) return;

    planInput.value = formatMoney(
      data?.settings?.monthlyPlan
    );

    lastYearInput.value = formatMoney(
      data?.settings?.lastYearRevenue
    );

    closedDays = [
      ...(data?.settings?.closedDays ?? [])
    ];

    updateCalendar();
    saveStatus.textContent = "";
  } catch (error) {
    console.error("Chyba načítání:", error);
    saveStatus.textContent = "Nepodařilo se načíst nastavení.";
  }
}

async function saveSettings() {
  const { storeId, year, month } = getSelection();

  if (!validSelection(year, month)) {
    saveStatus.textContent = "Zkontroluj rok a měsíc.";
    return;
  }

  try {
    const existing = await loadMonth(storeId, year, month);

    const settings = {
      ...(existing?.settings ??
        createDefaultSettings(storeId, year, month))
    };

    settings.monthlyPlan = parseMoney(planInput.value);
    settings.lastYearRevenue = parseMoney(lastYearInput.value);
    settings.closedDays = [...closedDays];

    await saveMonth(storeId, year, month, {
      ...(existing ?? {}),
      settings
    });

    saveStatus.textContent = "Nastavení uloženo ✓";
  } catch (error) {
    console.error("Chyba ukládání:", error);
    saveStatus.textContent = "Nepodařilo se uložit nastavení.";
  }
}

storeInput.addEventListener("change", loadSettings);
monthInput.addEventListener("change", loadSettings);
yearInput.addEventListener("change", loadSettings);

[planInput, lastYearInput].forEach(input => {
  input.addEventListener("input", () => {
    formatMoneyWhileTyping(input);
    markUnsaved();
  });
});

document
  .getElementById("saveSettings")
  .addEventListener("click", saveSettings);

loadSettings();
