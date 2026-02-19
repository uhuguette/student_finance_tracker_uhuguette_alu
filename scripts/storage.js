const KEY = "finance-data";

export function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    // corrupted data: return empty array and clear storage key
    localStorage.removeItem(KEY);
    return [];
  }
}

export function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}
