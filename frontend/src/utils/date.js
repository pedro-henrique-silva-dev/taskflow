const MS_PER_DAY = 24 * 60 * 60 * 1000;

function pad(value) {
  return String(value).padStart(2, '0');
}

export function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getTodayISO() {
  return toISODate(new Date());
}

export function addDays(isoDate, days) {
  const date = parseISODate(isoDate);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function parseISODate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function isValidISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return toISODate(parseISODate(value)) === value;
}

export function daysBetween(fromISO, toISO) {
  return Math.round((parseISODate(toISO) - parseISODate(fromISO)) / MS_PER_DAY);
}

export function formatDate(isoDate) {
  if (!isoDate) return '';
  return parseISODate(isoDate).toLocaleDateString('pt-BR');
}

export function describeDueDate(isoDate, todayISO) {
  if (!isoDate) return 'Sem prazo';
  const diff = daysBetween(todayISO, isoDate);
  if (diff === 0) return 'Vence hoje';
  if (diff === 1) return 'Vence amanhã';
  if (diff === -1) return 'Venceu ontem';
  if (diff < 0) return `Venceu há ${Math.abs(diff)} dias`;
  if (diff <= 7) return `Vence em ${diff} dias`;
  return formatDate(isoDate);
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function formatLongDate(date = new Date()) {
  const text = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
}
