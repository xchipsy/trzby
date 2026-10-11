
const DAYS = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];

export function renderCalendar(container, year, month, closedDays = [], onChange) {
  container.innerHTML = "";

  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const offset = (firstDay.getDay() + 6) % 7;
  const closed = new Set(closedDays.map(Number));

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
    button.textContent = day;

    const weekday = new Date(year, month - 1, day).getDay();

    if (weekday === 0 || weekday === 6) {
      button.classList.add("weekend");
    }

    if (closed.has(day)) {
      button.classList.add("closed");
    }

    button.setAttribute("aria-pressed", String(closed.has(day)));
    button.title = closed.has(day)
      ? "Zavřeno – kliknutím změnit"
      : "Otevřeno – kliknutím označit jako zavřeno";

    button.addEventListener("click", () => {
      if (closed.has(day)) {
        closed.delete(day);
      } else {
        closed.add(day);
      }

      button.classList.toggle("closed", closed.has(day));
      button.setAttribute("aria-pressed", String(closed.has(day)));
      button.title = closed.has(day)
        ? "Zavřeno – kliknutím změnit"
        : "Otevřeno – kliknutím označit jako zavřeno";

      onChange?.([...closed].sort((a, b) => a - b));
    });

    grid.appendChild(button);
  }

  container.appendChild(grid);
}

