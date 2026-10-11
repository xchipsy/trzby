
const PREFIX = "sz-trzby-test-v1:";

// Zatím pouze lokální testovací úložiště.
// Nepoužívat pro skutečná firemní data.

function makeKey(storeId, year, month) {
  return `${PREFIX}${storeId}:${year}:${month}`;
}

export async function loadMonth(storeId, year, month) {
  const raw = localStorage.getItem(makeKey(storeId, year, month));

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Chyba při načítání dat:", error);
    return null;
  }
}

export async function saveMonth(storeId, year, month, data) {
  localStorage.setItem(
    makeKey(storeId, year, month),
    JSON.stringify(data)
  );
}

export async function deleteMonth(storeId, year, month) {
  localStorage.removeItem(makeKey(storeId, year, month));
}

