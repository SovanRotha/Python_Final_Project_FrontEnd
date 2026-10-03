import { createResourceApi } from "./httpClient.js";

const trips = createResourceApi("trips");

export const fetchTrips = () => trips.list();
export const fetchTripById = (id) => trips.getById(id);
export const createTrip = (tripData) => trips.create(tripData);
export const updateTrip = (id, tripData) => trips.update(id, tripData);
export const deleteTrip = (id) => trips.remove(id);

const tripApi = {
  list: fetchTrips,
  getById: fetchTripById,
  create: createTrip,
  update: updateTrip,
  remove: deleteTrip,
};

export default tripApi;
