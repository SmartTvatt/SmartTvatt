import assert from 'node:assert/strict';
import test from 'node:test';
import TimeSlot from '../models/TimeSlot.js';
import { isTimeSlotAvailable, validateIntervals } from '../services/timeSlotService.js';

test('models the saved weekly schedule and weekday overrides', async () => {
  const schedule = new TimeSlot();
  schedule.set('dayOverrides.thursday', [
    { id: 'weekday', start: '12:00', end: '16:00' },
  ]);
  await schedule.validate();

  assert.equal(schedule.id, 'weekly');
  assert.deepEqual(schedule.toObject().dayOverrides.thursday, [
    { id: 'weekday', start: '12:00', end: '16:00' },
  ]);
});

test('validates and normalizes intervals, allowing adjacent time ranges', () => {
  const result = validateIntervals([
    { id: 1, start: '08:00', end: '12:00' },
    { id: 'later', start: '12:00', end: '16:00' },
  ]);

  assert.deepEqual(result, {
    intervals: [
      { id: '1', start: '08:00', end: '12:00' },
      { id: 'later', start: '12:00', end: '16:00' },
    ],
  });
});

test('allows an interval to end at midnight but not start at 24:00', async () => {
  const intervals = [{ id: 'evening', start: '20:00', end: '24:00' }];
  assert.deepEqual(validateIntervals(intervals), { intervals });

  const schedule = new TimeSlot({ intervals });
  await schedule.validate();

  assert.ok(validateIntervals([{ id: 'invalid-start', start: '24:00', end: '24:00' }]).error);
  assert.ok(validateIntervals([{ id: 'invalid-end', start: '20:00', end: '24:01' }]).error);
});

test('rejects invalid, duplicate, and overlapping intervals', () => {
  assert.ok(validateIntervals([{ id: 'bad', start: '25:00', end: '26:00' }]).error);
  assert.ok(validateIntervals([
    { id: 'same', start: '08:00', end: '12:00' },
    { id: 'same', start: '12:00', end: '16:00' },
  ]).error);
  assert.ok(validateIntervals([
    { id: 'first', start: '08:00', end: '12:00' },
    { id: 'second', start: '11:59', end: '16:00' },
  ]).error);
});

test('uses a weekday override instead of the shared weekly intervals', () => {
  const schedule = {
    intervals: [{ start: '08:00', end: '12:00' }],
    dayOverrides: {
      thursday: [{ start: '12:00', end: '16:00' }],
    },
  };
  const thursday = new Date('2026-10-29T00:00:00.000Z');
  const friday = new Date('2026-10-30T00:00:00.000Z');

  assert.equal(isTimeSlotAvailable(schedule, thursday, '12:00–16:00'), true);
  assert.equal(isTimeSlotAvailable(schedule, thursday, '08:00–12:00'), false);
  assert.equal(isTimeSlotAvailable(schedule, friday, '08:00–12:00'), true);
});
