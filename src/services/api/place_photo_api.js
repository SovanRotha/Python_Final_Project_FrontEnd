import { apiRequest } from "./httpClient.js";

const PLACE_PHOTOS_PATH = "/place-photos";

export function fetchPlacePhotos() {
  return apiRequest(PLACE_PHOTOS_PATH);
}

export function fetchPlacePhotoById(id) {
  return apiRequest(`${PLACE_PHOTOS_PATH}/${encodeURIComponent(String(id))}`);
}

export function createPlacePhoto(photoData) {
  return apiRequest(PLACE_PHOTOS_PATH, {
    method: "POST",
    body: JSON.stringify(photoData),
  });
}

export async function deletePlacePhoto(id) {
  const result = await apiRequest(
    `${PLACE_PHOTOS_PATH}/${encodeURIComponent(String(id))}`,
    { method: "DELETE" },
  );
  return result === null ? true : result;
}

const placePhotoApi = {
  list: fetchPlacePhotos,
  getById: fetchPlacePhotoById,
  create: createPlacePhoto,
  remove: deletePlacePhoto,
};

export default placePhotoApi;
