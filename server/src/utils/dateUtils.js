const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseCalendarDate(dateString) {
  if (typeof dateString !== 'string' || !DATE_PATTERN.test(dateString)) {
    return null;
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatCalendarDate(date) {
  return date.toISOString().slice(0, 10);
}

function getTodayCalendarDate() {
  return formatCalendarDate(new Date());
}

function getDaysUntilRenewal(nextRenewalDate) {
  const renewal = parseCalendarDate(nextRenewalDate);
  const today = parseCalendarDate(getTodayCalendarDate());
  return Math.round((renewal - today) / 86400000);
}

export function isRenewingSoon(daysUntilRenewal) {
  return daysUntilRenewal >= 0 && daysUntilRenewal <= 7;
}

function addCalendarDays(dateString, days) {
  const date = parseCalendarDate(dateString);
  date.setUTCDate(date.getUTCDate() + days);
  return formatCalendarDate(date);
}

export function isValidCalendarDate(dateString) {
  return Boolean(parseCalendarDate(dateString));
}

export { addCalendarDays, getDaysUntilRenewal, getTodayCalendarDate };
