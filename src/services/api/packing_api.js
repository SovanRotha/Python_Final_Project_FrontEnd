import { apiRequest } from "./httpClient.js";

const PACKING_PATH = "/packing";

export const fetchPackingItems = () => apiRequest(PACKING_PATH);
export const fetchPackingItemById = (id) =>
  apiRequest(`${PACKING_PATH}/${encodeURIComponent(String(id))}`);
export const createPackingItem = (itemData) =>
  apiRequest(PACKING_PATH, {
    method: "POST",
    body: JSON.stringify(itemData),
  });
export async function deletePackingItem(id) {
  const result = await apiRequest(
    `${PACKING_PATH}/${encodeURIComponent(String(id))}`,
    { method: "DELETE" },
  );
  return result === null ? true : result;
}

const packingApi = {
  list: fetchPackingItems,
  getById: fetchPackingItemById,
  create: createPackingItem,
  remove: deletePackingItem,
};

export default packingApi;