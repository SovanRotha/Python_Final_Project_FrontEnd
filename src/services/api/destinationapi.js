const BASE_URL = 'http://127.0.0.1:8000/api/v1';

export async function getDestinations() {
    try {
        const response = await fetch(`${BASE_URL}/destinations`);
        if (!response.ok) {
            throw new Error (`HTTP error! status: ${response.status}`);
        }
        return await response.json()

    }catch(error) {
        console.warn('API Request failed, falling back to local data:', error.message);
    }
    return null;

}
export async function getRecommendedPlaces() {
  try {
    const response = await fetch(`${BASE_URL}/places`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('API Request failed, falling back to local data:', error.message);
    return null;
  }
}