import { createResourceApi } from "./httpClient.js";

const notifications = createResourceApi("notifications");

export const fetchNotifications = () => notifications.list();
export const fetchNotificationById = (id) => notifications.getById(id);
export const createNotification = (notificationData) =>
  notifications.create(notificationData);
export const updateNotification = (id, notificationData) =>
  notifications.update(id, notificationData);
export const markNotificationAsRead = (id) =>
  updateNotification(id, { is_read: true });
export const deleteNotification = (id) => notifications.remove(id);

const notificationApi = {
  list: fetchNotifications,
  getById: fetchNotificationById,
  create: createNotification,
  update: updateNotification,
  markAsRead: markNotificationAsRead,
  remove: deleteNotification,
};

export default notificationApi;
