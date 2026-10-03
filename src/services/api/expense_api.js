import { createResourceApi } from "./httpClient.js";

const expenseApi = createResourceApi("expenses");

export const fetchExpenses = () => expenseApi.list();
export const fetchExpenseById = (id) => expenseApi.getById(id);
export const createExpense = (expenseData) => expenseApi.create(expenseData);
export const updateExpense = (id, expenseData) =>
  expenseApi.update(id, expenseData);
export const deleteExpense = (id) => expenseApi.remove(id);

export default expenseApi;