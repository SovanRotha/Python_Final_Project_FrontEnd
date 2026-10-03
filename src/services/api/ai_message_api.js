import { apiRequest, createResourceApi } from "./httpClient.js";

const messages = createResourceApi("ai/messages");

export const fetchAIMessages = () => messages.list();
export const fetchAIMessageById = (id) => messages.getById(id);
export const createAIMessage = (messageData) => messages.create(messageData);
export const updateAIMessage = (id, messageData) =>
  messages.update(id, messageData);
export const deleteAIMessage = (id) => messages.remove(id);
export const sendAIChatMessage = (conversationId, message) =>
  apiRequest(
    `/ai/conversations/${encodeURIComponent(String(conversationId))}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ message }),
    },
  );

const aiMessageApi = {
  list: fetchAIMessages,
  getById: fetchAIMessageById,
  create: createAIMessage,
  update: updateAIMessage,
  remove: deleteAIMessage,
  send: sendAIChatMessage,
};

export default aiMessageApi;
