// localStorage helpers
export function saveData(key, data) {
  const all = JSON.parse(localStorage.getItem(key) || '[]');
  all.unshift({ ...data, time: new Date().toLocaleString() });
  const trimmed = all.slice(0, 50);
  localStorage.setItem(key, JSON.stringify(trimmed));
  return trimmed;
}

export function loadData(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

export function getSetting(key, defaultVal = false) {
  const val = localStorage.getItem('setting_' + key);
  if (val === null) return defaultVal;
  return val === 'true';
}

export function setSetting(key, val) {
  localStorage.setItem('setting_' + key, val);
}
