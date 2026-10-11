

const DAYS = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];

const FIXED_HOLIDAYS = {
  "1-1": "Nový rok / Den obnovy samostatného českého státu",
  "5-1": "Svátek práce",
  "5-8": "Den vítězství",
  "7-5": "Den slovanských věrozvěstů Cyrila a Metoděje",
  "7-6": "Den upálení mistra Jana Husa",
  "9-28": "Den české státnosti",
  "10-28": "Den vzniku samostatného československého státu",
  "11-17": "Den boje za svobodu a demokracii",
  "12-24": "Štědrý den",
  "12-25": "1. svátek vánoční",
  "12-26": "2. svátek vánoční"
};

function getEasterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k + 7) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

function getHolidays(year) {
  const holidays = new Map(Object.entries(FIXED_HOLIDAYS));

  const easter = getEasterSunday(year);

  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);

  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);

  holidays.set(
    `${goodFriday.getMonth() + 1}-${goodFriday.getDate()}`,
    "Velký pátek"
  );

  holidays.set(
    `${easterMonday.getMonth() + 1}-${easterMonday.getDate()}`,
    "Velikonoční pondělí"
  );

  return holidays;
}

export function renderCalendar(
  container,
  year,
  month,
  closedDays = [],
  onChange
) {
  container.replaceChildren();

  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const offset = (firstDay.getDay() + 6) % 7;

  const closed = new Set(closedDays.map(Number));
  const holidays = getHolidays(year);

  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  DAYS.forEach(day => {
    const heading = document.createElement("div");
    heading.className = "calendar-heading";
    heading.textContent = day;
    grid.appendChild(heading);
  });

  for (let i = 0; i < offset; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-empty";
    grid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "calendar-day";

    const date = new Date(year, month - 1, day);
    const weekday = date.getDay();
    const holiday = holidays.get(`${month}-${day}`);

    const number = document.createElement("span");
    number.textContent = day;
    button.appendChild(number);

    if (weekday === 0 || weekday === 6) {
      button.classList.add("weekend");
    }

    if (holiday) {
      button.classList.add("holiday");

      const symbol = document.createElement("span");
      symbol.className = "holiday-symbol";
      symbol.textContent = "✳";
      symbol.setAttribute("aria-hidden", "true");

      button.appendChild(symbol);
    }

    function updateButton() {
      const isClosed = closed.has(day);

      button.classList.toggle("closed", isClosed);
      button.setAttribute("aria-pressed", String(isClosed));

      const status = isClosed ? "Zavřeno" : "Otevřeno";

      button.title = holiday
        ? `${holiday} – ${status}`
        : status;

      button.setAttribute(
        "aria-label",
        `${day}. ${month}. ${year}, ${holiday ? holiday + ", " : ""}${status}`
      );
    }

    updateButton();

    button.addEventListener("click", () => {
      if (closed.has(day)) {
        closed.delete(day);
      } else {
        closed.add(day);
      }

      updateButton();

      onChange?.(
        [...closed].sort((a, b) => a - b)
      );
    });

    grid.appendChild(button);
  }

  container.appendChild(grid);
}
