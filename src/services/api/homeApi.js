import { apiRequest } from "./httpClient.js";

function requireList(data, endpoint) {
  if (!Array.isArray(data)) {
    throw new Error(`Expected a list from ${endpoint}.`);
  }
  return data;
}

export async function getHomeDestinations(limit = 100) {
  const data = await apiRequest("/destinations");
  return requireList(data, "/destinations").slice(0, limit);
}
