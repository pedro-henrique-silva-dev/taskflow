export function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function hasKey(key) {
  return window.localStorage.getItem(key) !== null;
}
