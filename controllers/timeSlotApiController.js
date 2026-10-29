import TimeSlot, { WEEKDAY_KEYS } from '../models/TimeSlot.js';
import { loadWeeklySchedule, validateIntervals } from '../services/timeSlotService.js';

function serializeSchedule(schedule) {
  const plainSchedule = schedule.toObject();
  return {
    intervals: plainSchedule.intervals,
    dayOverrides: plainSchedule.dayOverrides ?? {},
  };
}

export async function getTimeSlots(req, res) {
  try {
    const schedule = await loadWeeklySchedule();
    res.json(serializeSchedule(schedule));
  } catch (error) {
    console.error('Fel vid hämtning av bokningsschema:', error.message);
    res.status(500).json({ message: 'Kunde inte hämta bokningsschemat.' });
  }
}

export async function updateTimeSlots(req, res) {
  const { dayKey } = req.body ?? {};
  if (dayKey !== undefined && !WEEKDAY_KEYS.includes(dayKey)) {
    return res.status(400).json({ message: 'Ogiltig veckodag.' });
  }

  const result = validateIntervals(req.body?.intervals);
  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  try {
    const path = dayKey ? `dayOverrides.${dayKey}` : 'intervals';
    await loadWeeklySchedule();
    const schedule = await TimeSlot.findByIdAndUpdate(
      'weekly',
      { $set: { [path]: result.intervals } },
      { new: true, runValidators: true }
    );

    res.json(serializeSchedule(schedule));
  } catch (error) {
    console.error('Fel vid uppdatering av bokningsschema:', error.message);
    res.status(500).json({ message: 'Kunde inte spara bokningsschemat.' });
  }
}
