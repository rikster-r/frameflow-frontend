import { DateTime } from "luxon";

export function getCurrentTimeDifference(timestamp: string) {
  const date = DateTime.fromISO(timestamp);
  const now = DateTime.now();
  const diff = now
    .diff(date, ["years", "weeks", "days", "hours", "minutes"])
    .toObject();

  if (diff.years && diff.years > 0) {
    return `${diff.years} y.`;
  } else if (diff.weeks && diff.weeks > 0) {
    return `${diff.weeks} w.`;
  } else if (diff.days && diff.days > 0) {
    return `${diff.days} d.`;
  } else if (diff.hours && diff.hours > 0) {
    return `${diff.hours} h.`;
  } else if (diff.minutes && diff.minutes > 0) {
    return `${diff.minutes} m.`;
  }
}

export function formatTimestamp(timestamp: string) {
  const date = DateTime.fromISO(timestamp);
  return date.setLocale("en").toLocaleString(DateTime.DATE_FULL);
}
