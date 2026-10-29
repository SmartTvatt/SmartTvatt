import TimeSlot, { defaultIntervals } from '../models/TimeSlot.js';

const SCHEDULE_ID = 'weekly';
const START_TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const END_TIME_PATTERN = /^(?:(?:[01]\d|2[0-3]):[0-5]\d|24:00)$/;
const WEEKDAY_KEYS_BY_UTC_DAY = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export async function loadWeeklySchedule() {
  return TimeSlot.findByIdAndUpdate(
    SCHEDULE_ID,
    { $setOnInsert: { intervals: defaultIntervals } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
}

export function validateIntervals(value) {
  if (!Array.isArray(value) || value.length > 24) {
    return { error: 'Ange högst 24 tidsintervall.' };
  }

  const ids = new Set();
  const intervals = [];
  for (const interval of value) {
    if (
      !interval ||
      (typeof interval.id !== 'string' && typeof interval.id !== 'number') ||
      !String(interval.id).trim() ||
      typeof interval.start !== 'string' ||
      !START_TIME_PATTERN.test(interval.start) ||
      typeof interval.end !== 'string' ||
      !END_TIME_PATTERN.test(interval.end) ||
      interval.start >= interval.end
    ) {
      return { error: 'Varje intervall måste ha ett id och en giltig start- och sluttid.' };
    }

    const id = String(interval.id);
    if (ids.has(id)) return { error: 'Varje tidsintervall måste ha ett unikt id.' };
    ids.add(id);
    intervals.push({ id, start: interval.start, end: interval.end });
  }

  const sortedIntervals = [...intervals].sort((left, right) =>
    left.start.localeCompare(right.start)
  );
  for (let index = 1; index < sortedIntervals.length; index += 1) {
    if (sortedIntervals[index].start < sortedIntervals[index - 1].end) {
      return { error: 'Tidsintervallen får inte överlappa.' };
    }
  }

  return { intervals };
}

export function isTimeSlotAvailable(schedule, date, time) {
  const weekday = WEEKDAY_KEYS_BY_UTC_DAY[date.getUTCDay()];
  const dayIntervals = schedule.dayOverrides?.[weekday];
  const configuredIntervals = dayIntervals ?? schedule.intervals;
  return configuredIntervals.some(
    (interval) => `${interval.start}–${interval.end}` === time
  );
}
