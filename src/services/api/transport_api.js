import { createResourceApi } from "./httpClient.js";

const transports = createResourceApi("transports");

export const fetchTransports = () => transports.list();
export const fetchTransportById = (id) => transports.getById(id);
export const createTransport = (transportData) =>
  transports.create(transportData);
export const updateTransport = (id, transportData) =>
  transports.update(id, transportData);
export const deleteTransport = (id) => transports.remove(id);

const transportApi = {
  list: fetchTransports,
  getById: fetchTransportById,
  create: createTransport,
  update: updateTransport,
  remove: deleteTransport,
};

export default transportApi;