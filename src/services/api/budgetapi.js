import { createResourceApi } from "./httpClient.js";

const budgetApi = createResourceApi("budgets");

export const fetchBudgets = () => budgetApi.list();
export const fetchBudgetById = (id) => budgetApi.getById(id);
export const createBudget = (budgetData) => budgetApi.create(budgetData);
export const updateBudget = (id, budgetData) =>
  budgetApi.update(id, budgetData);
export const deleteBudget = (id) => budgetApi.remove(id);

export default budgetApi;