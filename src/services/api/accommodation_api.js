import { createResourceApi } from "./httpClient.js";

const accommodations = createResourceApi("accommodations");

export const fetchAccommodations = () => accommodations.list();
export const fetchAccommodationById = (id) => accommodations.getById(id);
export const createAccommodation = (accommodationData) =>
  accommodations.create(accommodationData);
export const updateAccommodation = (id, accommodationData) =>
  accommodations.update(id, accommodationData);
export const deleteAccommodation = (id) => accommodations.remove(id);

const accommodationApi = {
  list: fetchAccommodations,
  getById: fetchAccommodationById,
  create: createAccommodation,
  update: updateAccommodation,
  remove: deleteAccommodation,
};

export default accommodationApi;