import { createResourceApi } from "./httpClient.js";

const budgetCategoryApi = createResourceApi("budget-categories");

export const fetchBudgetCategories = () => budgetCategoryApi.list();
export const fetchBudgetCategoryById = (id) =>
  budgetCategoryApi.getById(id);
export const createBudgetCategory = (categoryData) =>
  budgetCategoryApi.create(categoryData);
export const updateBudgetCategory = (id, categoryData) =>
  budgetCategoryApi.update(id, categoryData);
export const deleteBudgetCategory = (id) =>
  budgetCategoryApi.remove(id);

export default budgetCategoryApi;