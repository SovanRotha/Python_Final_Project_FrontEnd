const BASE_URL = 'http://127.0.0.1:8000/api/v1';

/**
 * Gets authorization headers with JWT token from localStorage
 */
function getAuthHeaders() {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * GET /api/v1/destinations
 * Fetches destinations from Swagger backend
 */
export async function getDestinations(limit = 50) {
  try {
    const response = await fetch(`${BASE_URL}/destinations?limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Destination API returned HTTP ${response.status}.`);
    }

    return await response.json();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown request error.';
    console.error('Failed to fetch destinations:', message);
    return { error: message };
  }
}

/**
 * GET /api/v1/places
 * Fetches recommended places from the backend.
 */
export async function getRecommendedPlaces(limit = 50) {
  try {
    const response = await fetch(`${BASE_URL}/places?limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Places API returned HTTP ${response.status}.`);
    }

    return await response.json();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown request error.';
    console.error('Failed to fetch recommended places:', message);
    return { error: message };
  }
}

/**
 * GET /api/v1/destinations/{resource_id}
 * Fetches a destination by ID.
 */
export async function getDestinationById(resourceId) {
  try {
    const response = await fetch(`${BASE_URL}/destinations/${resourceId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch destination ${resourceId}:`, error.message);
    return null;
  }
}

/**
 * POST /api/v1/destinations
 * Creates a new destination in the database
 */
export async function createDestination(payload) {
  try {
    const response = await fetch(`${BASE_URL}/destinations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: payload.name || '',
        country: payload.country || '',
        country_code: payload.country_code || '',
        description: payload.description || '',
        image: payload.image || '',
        currency: payload.currency || 'USD',
        language: payload.language || 'English',
        timezone: payload.timezone || 'Asia/Phnom_Penh',
        best_time: payload.best_time || 'All Year',
        average_daily_cost: Number(payload.average_daily_cost) || 0,
      }),
    });

    if (response.status === 201) {
      return await response.json();
    }

    if (response.status === 401) {
      alert('Your session expired. Please log in again.');
      return null;
    }

    throw new Error(`Failed with status ${response.status}`);
  } catch (error) {
    console.error('Failed to create destination:', error.message);
    return null;
  }
}