const BASE_URL = 'http://127.0.0.1:8000/api/v1';

/**
 * Fetch list of destinations from backend
 * @param {number} limit - Maximum number of destinations to retrieve (default: 50)
 */
export async function getDestinations(limit = 50) {
  try {
    const response = await fetch(`${BASE_URL}/destinations?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('API Request failed, falling back to local data:', error.message);
    return null;
  }
}

/**
 * Fetch a single destination by ID
 */
export async function getDestinationById(id) {
  try {
    const response = await fetch(`${BASE_URL}/destinations/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch destination ${id}:`, error.message);
    return null;
  }
}

/**
 * Fetch recommended places
 */
export async function getRecommendedPlaces(limit = 50) {
  try {
    const response = await fetch(`${BASE_URL}/places?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('API Request failed, falling back to local data:', error.message);
    return null;
  }
}

/**
 * Fetch saved places
 */
export async function getSavedPlaces() {
  try {
    const response = await fetch(`${BASE_URL}/saved-places`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('API Request failed, falling back to local data:', error.message);
    return null;
  }
}