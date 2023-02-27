import { DateTime } from "luxon";

export function getCurrentTimeDifference(timestamp: string) {
  const date = DateTime.fromISO(timestamp);
  const now = DateTime.now();
  const diff = now
    .diff(date, ["years", "weeks", "days", "hours", "minutes", "seconds"])
    .toObject();

  if (diff.years && Math.floor(diff.years) > 0) {
    return `${Math.floor(diff.years)} y.`;
  } else if (diff.weeks && Math.floor(diff.weeks) > 0) {
    return `${Math.floor(diff.weeks)} w.`;
  } else if (diff.days && Math.floor(diff.days) > 0) {
    return `${Math.floor(diff.days)} d.`;
  } else if (diff.hours && Math.floor(diff.hours) > 0) {
    return `${Math.floor(diff.hours)} h.`;
  } else if (diff.minutes && Math.floor(diff.minutes) > 0) {
    return `${Math.floor(diff.minutes)} m.`;
  } else if (diff.seconds && Math.floor(diff.seconds) > 0) {
    return `${Math.floor(diff.seconds)} s.`;
  } else {
    return "now";
  }
}

export function formatTimestamp(timestamp: string) {
  const date = DateTime.fromISO(timestamp);
  return date.setLocale("en").toLocaleString(DateTime.DATE_FULL);
}
