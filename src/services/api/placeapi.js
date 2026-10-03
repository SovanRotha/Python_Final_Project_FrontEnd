import { apiRequest } from "./httpClient.js";

function requirePlaceList(data) {
  if (!Array.isArray(data)) {
    throw new Error("Expected a list from /places.");
  }
  return data;
}

export async function fetchPlaces(limit = 100) {
  const data = await apiRequest("/places");
  return requirePlaceList(data).slice(0, limit);
}

export async function fetchPlacesByDestination(destinationId, limit = 100) {
  const places = await fetchPlaces();
  return places
    .filter((place) => String(place.destination_id) === String(destinationId))
    .slice(0, limit);
}

export function fetchPlaceById(id) {
  return apiRequest(`/places/${encodeURIComponent(String(id))}`);
}

export function createPlace(placeData) {
  return apiRequest("/places", {
    method: "POST",
    body: JSON.stringify(placeData),
  });
}

export async function deletePlace(id) {
  const result = await apiRequest(
    `/places/${encodeURIComponent(String(id))}`,
    { method: "DELETE" },
  );
  return result === null ? true : result;
}

const placeApi = {
  list: fetchPlaces,
  getById: fetchPlaceById,
  getByDestination: fetchPlacesByDestination,
  create: createPlace,
  remove: deletePlace,
};

export default placeApi;