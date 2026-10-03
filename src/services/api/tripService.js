const BASE_URL = 'http://127.0.0.1:8000/api/v1';
const LOCAL_TRIPS_KEY = 'tripos.localTrips';

function getAuthHeaders() {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getLocalTrips() {
  try {
    const storedTrips = localStorage.getItem(LOCAL_TRIPS_KEY);
    if (!storedTrips) return [];

    const trips = JSON.parse(storedTrips);
    return Array.isArray(trips) ? trips : [];
  } catch (error) {
    console.error('Could not read locally saved trips:', error);
    return [];
  }
}

function saveLocalTrips(trips) {
  try {
    localStorage.setItem(LOCAL_TRIPS_KEY, JSON.stringify(trips));
    return true;
  } catch (error) {
    console.error('Could not save trips in this browser:', error);
    return false;
  }
}

async function requestTrips(path, options) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Trip API request failed (HTTP ${response.status}).`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function getTrips(limit = 50) {
  try {
    const apiTrips = await requestTrips('/trips', { method: 'GET' });
    const localTrips = getLocalTrips();
    const trips = [
      ...localTrips,
      ...(Array.isArray(apiTrips) ? apiTrips : []),
    ];
    return trips.slice(0, limit);
  } catch (error) {
    console.warn('Using browser-saved trips because the trip API is unavailable:', error);
    return getLocalTrips().slice(0, limit);
  }
}

export async function createTrip(tripData) {
  const hasRequiredApiFields =
    Number.isInteger(Number(tripData.destination_id)) &&
    tripData.start_date &&
    tripData.end_date &&
    tripData.currency;

  if (hasRequiredApiFields) {
    try {
      return await requestTrips('/trips', {
        method: 'POST',
        body: JSON.stringify(tripData),
      });
    } catch (error) {
      console.warn('Trip API is unavailable; saving this trip in the browser:', error);
    }
  }

  const localTrip = {
    ...tripData,
    id: `local-trip-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const savedTrips = saveLocalTrips([localTrip, ...getLocalTrips()]);

  if (!savedTrips) return null;
  return localTrip;
}

export async function deleteTrip(tripId) {
  const matchingLocalTrip = getLocalTrips().some(
    (trip) => String(trip.id) === String(tripId),
  );

  if (matchingLocalTrip) {
    const saved = saveLocalTrips(
      getLocalTrips().filter((trip) => String(trip.id) !== String(tripId)),
    );
    return saved;
  }

  try {
    await requestTrips(`/trips/${encodeURIComponent(String(tripId))}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error(`Could not delete trip ${tripId}:`, error);
    return false;
  }
}
