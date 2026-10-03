import { createResourceApi } from "./httpClient.js";

const conversations = createResourceApi("ai/conversations");

export const fetchAIConversations = () => conversations.list();
export const fetchAIConversationById = (id) => conversations.getById(id);
export const createAIConversation = (conversationData) =>
  conversations.create(conversationData);
export const updateAIConversation = (id, conversationData) =>
  conversations.update(id, conversationData);
export const deleteAIConversation = (id) => conversations.remove(id);

const aiConversationApi = {
  list: fetchAIConversations,
  getById: fetchAIConversationById,
  create: createAIConversation,
  update: updateAIConversation,
  remove: deleteAIConversation,
};

export default aiConversationApi;
