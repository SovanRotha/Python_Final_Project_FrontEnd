import { createResourceApi } from "./httpClient.js";

const checklists = createResourceApi("checklists");

export const fetchChecklists = () => checklists.list();
export const fetchChecklistById = (id) => checklists.getById(id);
export const createChecklist = (checklistData) =>
  checklists.create(checklistData);
export const updateChecklist = (id, checklistData) =>
  checklists.update(id, checklistData);
export const deleteChecklist = (id) => checklists.remove(id);

const checklistApi = {
  list: fetchChecklists,
  getById: fetchChecklistById,
  create: createChecklist,
  update: updateChecklist,
  remove: deleteChecklist,
};

export default checklistApi;