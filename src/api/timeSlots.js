async function readJsonResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Bokningsservern svarade inte med API-data (HTTP ${response.status}).`);
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Begäran kunde inte genomföras.');
  }
  return data;
}

export async function fetchTimeSlots(token, signal) {
  const response = await fetch('/api/timeslots', {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
  return readJsonResponse(response);
}

export async function saveTimeSlots(token, schedule) {
  const response = await fetch('/api/admin/timeslots', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(schedule),
  });
  return readJsonResponse(response);
}

export async function resetTimeSlotDay(token, dayKey) {
  const response = await fetch(`/api/admin/timeslots/${encodeURIComponent(dayKey)}`, {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + token },
  });
  return readJsonResponse(response);
}
