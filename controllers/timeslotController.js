const STORAGE_KEY = "smarttvatt.bookingIntervals";
const DAY_STORAGE_KEY = "smarttvatt.bookingIntervalsByDay";

export const bookingWeekdays = [
	{ key: "monday", label: "Måndag", short: "Mån" },
	{ key: "tuesday", label: "Tisdag", short: "Tis" },
	{ key: "wednesday", label: "Onsdag", short: "Ons" },
	{ key: "thursday", label: "Torsdag", short: "Tor" },
	{ key: "friday", label: "Fredag", short: "Fre" },
	{ key: "saturday", label: "Lördag", short: "Lör" },
	{ key: "sunday", label: "Söndag", short: "Sön" },
];

const defaultIntervals = [
	{ id: 1, start: "08:00", end: "12:00" },
	{ id: 2, start: "12:00", end: "16:00" },
	{ id: 3, start: "16:00", end: "20:00" },
];


function readDayOverrides() {
	try {
		const savedOverrides = window.localStorage.getItem(DAY_STORAGE_KEY);
		if (!savedOverrides) return {};

		const overrides = JSON.parse(savedOverrides);
		return overrides && typeof overrides === "object" && !Array.isArray(overrides)
			? overrides
			: {};
	} catch {
		return {};
	}
}

function isIntervalList(value) {
	return Array.isArray(value) && value.every(
		(interval) =>
			typeof interval.id === "number" &&
			typeof interval.start === "string" &&
			typeof interval.end === "string"
	);
}

export function getBookingIntervals(dayKey) {
	if (dayKey) {
		const dayIntervals = readDayOverrides()[dayKey];
		if (isIntervalList(dayIntervals)) return dayIntervals;
	}

	try {
		const savedIntervals = window.localStorage.getItem(STORAGE_KEY);
		if (!savedIntervals) return defaultIntervals;

		const intervals = JSON.parse(savedIntervals);
		if (isIntervalList(intervals)) return intervals;
	} catch {
		return defaultIntervals;
	}

	return defaultIntervals;
}

export function saveBookingIntervals(intervals, dayKey) {
	if (dayKey) {
		const dayOverrides = readDayOverrides();
		dayOverrides[dayKey] = intervals;
		window.localStorage.setItem(DAY_STORAGE_KEY, JSON.stringify(dayOverrides));
		return;
	}

	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(intervals));
}
