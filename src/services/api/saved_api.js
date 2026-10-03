import { createResourceApi } from "./httpClient.js";

const savedPlaces = createResourceApi("saved-places");

export const fetchSavedPlaces = () => savedPlaces.list();
export const fetchSavedPlaceById = (id) => savedPlaces.getById(id);
export const savePlace = (placeId) =>
  savedPlaces.create({ place_id: Number(placeId) });
export const removeSavedPlace = (id) => savedPlaces.remove(id);

const savedPlaceApi = {
  list: fetchSavedPlaces,
  getById: fetchSavedPlaceById,
  save: savePlace,
  remove: removeSavedPlace,
};

export default savedPlaceApi;