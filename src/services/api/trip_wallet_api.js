import { createResourceApi } from "./httpClient.js";

const tripWalletApi = createResourceApi("trip-wallets");

export const fetchTripWallets = () => tripWalletApi.list();
export const fetchTripWalletById = (id) => tripWalletApi.getById(id);
export const createTripWallet = (walletData) =>
  tripWalletApi.create(walletData);
export const updateTripWallet = (id, walletData) =>
  tripWalletApi.update(id, walletData);
export const deleteTripWallet = (id) => tripWalletApi.remove(id);

export default tripWalletApi;