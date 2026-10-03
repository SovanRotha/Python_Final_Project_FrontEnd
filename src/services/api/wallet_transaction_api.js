import { createResourceApi } from "./httpClient.js";

const walletTransactionApi = createResourceApi("wallet-transactions");

export const fetchWalletTransactions = () => walletTransactionApi.list();
export const fetchWalletTransactionById = (id) =>
  walletTransactionApi.getById(id);
export const createWalletTransaction = (transactionData) =>
  walletTransactionApi.create(transactionData);
export const updateWalletTransaction = (id, transactionData) =>
  walletTransactionApi.update(id, transactionData);
export const deleteWalletTransaction = (id) =>
  walletTransactionApi.remove(id);

export default walletTransactionApi;