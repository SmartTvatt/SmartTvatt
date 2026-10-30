export const bookingWeekdays = [
  { key: "monday", label: "Måndag", short: "Mån" },
  { key: "tuesday", label: "Tisdag", short: "Tis" },
  { key: "wednesday", label: "Onsdag", short: "Ons" },
  { key: "thursday", label: "Torsdag", short: "Tor" },
  { key: "friday", label: "Fredag", short: "Fre" },
  { key: "saturday", label: "Lördag", short: "Lör" },
  { key: "sunday", label: "Söndag", short: "Sön" },
];

export function getBookingIntervals(dayKey, schedule) {
  const dayIntervals = dayKey ? schedule?.dayOverrides?.[dayKey] : null;
  if (Array.isArray(dayIntervals)) return dayIntervals;
  return Array.isArray(schedule?.intervals) ? schedule.intervals : [];
}
