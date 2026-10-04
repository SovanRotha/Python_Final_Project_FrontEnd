import { createResourceApi } from "./httpClient.js";

const memories = createResourceApi("memories");

export const fetchMemories = () => memories.list();
export const fetchMemoryById = (id) => memories.getById(id);
export const createMemory = (memoryData) => memories.create(memoryData);
export const updateMemory = (id, memoryData) =>
  memories.update(id, memoryData);
export const deleteMemory = (id) => memories.remove(id);

const memoryApi = {
  list: fetchMemories,
  getById: fetchMemoryById,
  create: createMemory,
  update: updateMemory,
  remove: deleteMemory,
};

export default memoryApi;