import { createResourceApi } from "./httpClient.js";

const wallets = createResourceApi("wallets");
const walletApi = {
  // GET /wallets
  fetchWalletData: wallets.list,

  // GET /wallets/{id}
  fetchWalletById: wallets.getById,

  // POST /wallets
  createWallet: wallets.create,

  // PATCH /wallets/{id}
  updateWallet: wallets.update,

  // DELETE /wallets/{id}
  deleteWallet: wallets.remove,
};

export const fetchWallets = wallets.list;
export const fetchWalletById = wallets.getById;
export const createWallet = wallets.create;
export const updateWallet = wallets.update;
export const deleteWallet = wallets.remove;

export default walletApi;
