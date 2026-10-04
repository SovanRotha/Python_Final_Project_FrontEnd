import { createResourceApi } from "./httpClient.js";

const packingLists = createResourceApi("packing-lists");

export const fetchPackingLists = () => packingLists.list();
export const fetchPackingListById = (id) => packingLists.getById(id);
export const createPackingList = (listData) => packingLists.create(listData);
export const updatePackingList = (id, listData) =>
  packingLists.update(id, listData);
export const deletePackingList = (id) => packingLists.remove(id);

const packingListApi = {
  list: fetchPackingLists,
  getById: fetchPackingListById,
  create: createPackingList,
  update: updatePackingList,
  remove: deletePackingList,
};

export default packingListApi;