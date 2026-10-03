import { createResourceApi } from "./httpClient.js";

const reminders = createResourceApi("reminders");

export const fetchReminders = () => reminders.list();
export const fetchReminderById = (id) => reminders.getById(id);
export const createReminder = (reminderData) => reminders.create(reminderData);
export const updateReminder = (id, reminderData) =>
  reminders.update(id, reminderData);
export const deleteReminder = (id) => reminders.remove(id);

const reminderApi = {
  list: fetchReminders,
  getById: fetchReminderById,
  create: createReminder,
  update: updateReminder,
  remove: deleteReminder,
};

export default reminderApi;
