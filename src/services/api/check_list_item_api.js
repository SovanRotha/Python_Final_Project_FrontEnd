import { createResourceApi } from "./httpClient.js";

const checklistItems = createResourceApi("checklist-items");

export const fetchChecklistItems = () => checklistItems.list();
export const fetchChecklistItemById = (id) => checklistItems.getById(id);
export const createChecklistItem = (itemData) =>
  checklistItems.create(itemData);
export const updateChecklistItem = (id, itemData) =>
  checklistItems.update(id, itemData);
export const deleteChecklistItem = (id) => checklistItems.remove(id);

const checklistItemApi = {
  list: fetchChecklistItems,
  getById: fetchChecklistItemById,
  create: createChecklistItem,
  update: updateChecklistItem,
  remove: deleteChecklistItem,
};

export default checklistItemApi;