import { createResourceApi } from "./httpClient.js";

const memoryPhotos = createResourceApi("memory-photos");

export const fetchMemoryPhotos = () => memoryPhotos.list();
export const fetchMemoryPhotoById = (id) => memoryPhotos.getById(id);
export const createMemoryPhoto = (photoData) => memoryPhotos.create(photoData);
export const updateMemoryPhoto = (id, photoData) =>
  memoryPhotos.update(id, photoData);
export const deleteMemoryPhoto = (id) => memoryPhotos.remove(id);

const memoryPhotoApi = {
  list: fetchMemoryPhotos,
  getById: fetchMemoryPhotoById,
  create: createMemoryPhoto,
  update: updateMemoryPhoto,
  remove: deleteMemoryPhoto,
};

export default memoryPhotoApi;