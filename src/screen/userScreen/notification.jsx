import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  LoaderCircle,
  Plus,
  Trash2,
} from "lucide-react";
import notificationApi from "../../services/api/notificationapi.js";
import reminderApi from "../../services/api/reminderapi.js";
import tripApi from "../../services/api/tripapi.js";
import { useAuth } from "../../app/providers/authContext.js";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function Notification() {
  const { accessToken } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [creatingReminder, setCreatingReminder] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    tripId: "",
    title: "",
    description: "",
    dueDate: "",
    type: "custom",
  });
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async () => {
    try {
      const [data, reminderData, tripData] = await Promise.all([
        notificationApi.list(),
        reminderApi.list(),
        tripApi.list(),
      ]);
      setNotifications(
        [...data].sort(
          (left, right) =>
            new Date(right.created_at).getTime() -
            new Date(left.created_at).getTime(),
        ),
      );
      setReminders(
        [...reminderData].sort(
          (left, right) =>
            new Date(left.due_date).getTime() -
            new Date(right.due_date).getTime(),
        ),
      );
      setTrips(tripData);
      setNewReminder((current) => ({
        ...current,
        tripId: current.tripId || (tripData.length ? String(tripData[0].id) : ""),
      }));
      setError("");
    } catch (loadError) {
      console.error("Could not load notifications:", loadError);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load notifications.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (accessToken) void loadNotifications();
  }, [accessToken, loadNotifications]);

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read,
  ).length;
  const pendingReminderCount = reminders.filter(
    (reminder) => reminder.status === "pending",
  ).length;
  const visibleItems = useMemo(() => {
    const linkedReminderIds = new Set(
      notifications
        .map((notification) => notification.reminder_id)
        .filter((id) => id !== null && id !== undefined)
        .map(String),
    );
    const reminderItems = reminders
      .filter((reminder) => !linkedReminderIds.has(String(reminder.id)))
      .map((reminder) => ({ ...reminder, itemType: "reminder" }));
    const notificationItems = notifications
      .filter((notification) => filter !== "unread" || !notification.is_read)
      .map((notification) => ({ ...notification, itemType: "notification" }));
    const items =
      filter === "reminders"
        ? [...notifications
            .filter((notification) => notification.reminder_id)
            .map((notification) => ({
              ...notification,
              itemType: "notification",
            })), ...reminderItems]
        : filter === "unread"
          ? notificationItems
          : [...notificationItems, ...reminderItems];
    return items.sort((left, right) => {
      const leftDate =
        left.itemType === "reminder" ? left.due_date : left.created_at;
      const rightDate =
        right.itemType === "reminder" ? right.due_date : right.created_at;
      return new Date(rightDate).getTime() - new Date(leftDate).getTime();
    });
  }, [filter, notifications, reminders]);

  async function markAsRead(notification) {
    if (notification.is_read) return;
    setBusyId(notification.id);
    setError("");
    try {
      const updated = await notificationApi.markAsRead(notification.id);
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? updated : item,
        ),
      );
    } catch (updateError) {
      console.error("Could not mark notification as read:", updateError);
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update notification.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function markAllAsRead() {
    const unread = notifications.filter((item) => !item.is_read);
    if (!unread.length) return;
    setMarkingAll(true);
    setError("");
    const updatedIds = [];
    try {
      for (const notification of unread) {
        await notificationApi.markAsRead(notification.id);
        updatedIds.push(notification.id);
      }
      const readIds = new Set(updatedIds);
      setNotifications((current) =>
        current.map((item) =>
          readIds.has(item.id) ? { ...item, is_read: true } : item,
        ),
      );
    } catch (updateError) {
      console.error("Could not mark all notifications as read:", updateError);
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update notifications.",
      );
      if (updatedIds.length) {
        const readIds = new Set(updatedIds);
        setNotifications((current) =>
          current.map((item) =>
            readIds.has(item.id) ? { ...item, is_read: true } : item,
          ),
        );
      }
    } finally {
      setMarkingAll(false);
    }
  }

  async function deleteNotification(notificationId) {
    setBusyId(notificationId);
    setError("");
    try {
      await notificationApi.remove(notificationId);
      setNotifications((current) =>
        current.filter((item) => item.id !== notificationId),
      );
    } catch (deleteError) {
      console.error("Could not delete notification:", deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete notification.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function completeReminder(reminder) {
    const busyKey = `reminder:${reminder.id}`;
    setBusyId(busyKey);
    setError("");
    try {
      const updated = await reminderApi.update(reminder.id, {
        status: "completed",
      });
      setReminders((current) =>
        current.map((item) =>
          item.id === reminder.id ? updated : item,
        ),
      );
    } catch (updateError) {
      console.error("Could not complete reminder:", updateError);
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update reminder.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function createReminder(event) {
    event.preventDefault();
    const dueDate = new Date(newReminder.dueDate);
    if (
      !newReminder.tripId ||
      !newReminder.title.trim() ||
      !newReminder.dueDate ||
      Number.isNaN(dueDate.getTime())
    ) {
      setError("Choose a trip, enter a title, and set a valid due date.");
      return;
    }

    setCreatingReminder(true);
    setError("");
    try {
      const reminder = await reminderApi.create({
        trip_id: Number(newReminder.tripId),
        title: newReminder.title.trim(),
        description: newReminder.description.trim() || null,
        due_date: dueDate.toISOString(),
        type: newReminder.type,
        status: "pending",
      });
      setReminders((current) =>
        [...current, reminder].sort(
          (left, right) =>
            new Date(left.due_date).getTime() -
            new Date(right.due_date).getTime(),
        ),
      );
      setNewReminder((current) => ({
        ...current,
        title: "",
        description: "",
        dueDate: "",
      }));
      setShowReminderForm(false);
    } catch (createError) {
      console.error("Could not create reminder:", createError);
      setError(
        createError instanceof Error
          ? createError.message
          : "Could not create reminder.",
      );
    } finally {
      setCreatingReminder(false);
    }
  }

  if (!accessToken) {
    return (
      <main className="flex min-h-full items-center justify-center bg-slate-50 p-6">
        <section className="max-w-md rounded-2xl bg-white p-7 text-center shadow-sm ring-1 ring-slate-200">
          <Bell className="mx-auto text-teal-700" size={30} />
          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Sign in to view notifications
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Trip updates and reminders are private to your account.
          </p>
          <a
            className="mt-5 inline-flex rounded-xl bg-teal-800 px-5 py-3 text-sm font-semibold text-white"
            href="/budget"
          >
            Sign in
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-slate-50 p-5 text-slate-800 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
              Updates
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">
              Notifications
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Trip updates and reminders for your workspace.
              {unreadCount + pendingReminderCount > 0 && (
                <span className="ml-2 font-semibold text-teal-700">
                  {unreadCount} unread · {pendingReminderCount} pending reminders
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={trips.length === 0}
              onClick={() => setShowReminderForm((current) => !current)}
              type="button"
            >
              <Plus size={16} />
              <span>Add reminder</span>
            </button>
            <label className="sr-only" htmlFor="notification-filter">
              Filter notifications
            </label>
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
              id="notification-filter"
              onChange={(event) => setFilter(event.target.value)}
              value={filter}
            >
              <option value="all">All notifications</option>
              <option value="unread">Unread only</option>
              <option value="reminders">Reminders</option>
            </select>
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={unreadCount === 0 || markingAll || filter === "reminders"}
              onClick={() => void markAllAsRead()}
              type="button"
            >
              {markingAll ? (
                <LoaderCircle className="animate-spin" size={16} />
              ) : (
                <CheckCheck size={16} />
              )}
              <span className="hidden sm:inline">
                {markingAll ? "Updating…" : "Mark all read"}
              </span>
            </button>
          </div>
        </header>

        {error && (
          <div
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            <span>{error}</span>
            <button
              className="font-semibold underline"
              onClick={() => {
                setLoading(true);
                void loadNotifications();
              }}
              type="button"
            >
              Retry
            </button>
          </div>
        )}

        {showReminderForm && (
          <form
            className="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6"
            onSubmit={createReminder}
          >
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Create a reminder
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                It will appear in your reminder list when saved.
              </p>
            </div>
            {trips.length === 0 ? (
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Create a trip before adding a reminder.
              </p>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Trip
                    <select
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                      onChange={(event) =>
                        setNewReminder((current) => ({
                          ...current,
                          tripId: event.target.value,
                        }))
                      }
                      required
                      value={newReminder.tripId}
                    >
                      {trips.map((trip) => (
                        <option key={trip.id} value={trip.id}>
                          {trip.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Reminder type
                    <select
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 capitalize"
                      onChange={(event) =>
                        setNewReminder((current) => ({
                          ...current,
                          type: event.target.value,
                        }))
                      }
                      value={newReminder.type}
                    >
                      {[
                        "booking",
                        "payment",
                        "document",
                        "activity",
                        "packing",
                        "flight",
                        "custom",
                      ].map((type) => (
                        <option className="capitalize" key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="block text-sm font-medium text-slate-700">
                  Title
                  <input
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5"
                    maxLength={255}
                    onChange={(event) =>
                      setNewReminder((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder="e.g. Check in for your flight"
                    required
                    value={newReminder.title}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Due date and time
                  <input
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5"
                    onChange={(event) =>
                      setNewReminder((current) => ({
                        ...current,
                        dueDate: event.target.value,
                      }))
                    }
                    required
                    type="datetime-local"
                    value={newReminder.dueDate}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Notes (optional)
                  <textarea
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5"
                    onChange={(event) =>
                      setNewReminder((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    rows={3}
                    value={newReminder.description}
                  />
                </label>
                <div className="flex justify-end gap-2">
                  <button
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600"
                    onClick={() => setShowReminderForm(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                    disabled={creatingReminder || trips.length === 0}
                    type="submit"
                  >
                    {creatingReminder ? "Saving…" : "Save reminder"}
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        <section
          aria-label="Notification list"
          className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
        >
          {loading ? (
            <div
              className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500"
              role="status"
            >
              <LoaderCircle className="animate-spin" size={18} />
              Loading notifications…
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                {filter === "unread" ? <Check size={22} /> : <Bell size={22} />}
              </div>
              <h2 className="mt-4 text-lg font-bold">
                {filter === "unread"
                  ? "You’re all caught up"
                  : filter === "reminders"
                    ? "No reminders yet"
                    : "No notifications or reminders yet"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {filter === "unread"
                  ? "There are no unread notifications."
                  : "Trip updates and reminders will appear here."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {visibleItems.map((item) => {
                const isReminder = item.itemType === "reminder";
                const linkedReminder = isReminder
                  ? item
                  : reminders.find(
                      (reminder) =>
                        String(reminder.id) === String(item.reminder_id),
                    );
                const isRead = !isReminder && item.is_read;
                const title = isReminder ? item.title : item.title;
                const message = isReminder
                  ? item.description || `Reminder type: ${item.type}`
                  : item.message;
                const date = isReminder ? item.due_date : item.created_at;
                return (
                <li
                  className={`flex gap-3 px-4 py-5 transition sm:gap-4 sm:px-6 ${
                    isRead || (isReminder && item.status === "completed")
                      ? "bg-white"
                      : "bg-teal-50/50"
                  }`}
                  key={`${item.itemType}:${item.id}`}
                >
                  <span
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isRead || (isReminder && item.status === "completed")
                        ? "bg-slate-100 text-slate-500"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    {isReminder || item.reminder_id ? (
                      <CalendarDays size={18} />
                    ) : (
                      <Bell size={18} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-slate-900">
                        {title}
                      </h2>
                      {!isReminder && !item.is_read && (
                        <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-teal-800">
                          New
                        </span>
                      )}
                      {isReminder && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                          {item.status}
                        </span>
                      )}
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold capitalize text-slate-500">
                        {isReminder ? `Reminder · ${item.type}` : item.type}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {message}
                    </p>
                    <time
                      className="mt-2 block text-xs text-slate-400"
                      dateTime={date}
                    >
                      {isReminder ? "Due " : ""}{formatDate(date)}
                    </time>
                  </div>
                  <div className="flex shrink-0 items-start gap-1">
                    {linkedReminder?.status === "pending" && (
                      <button
                        aria-label={`Complete reminder ${linkedReminder.title}`}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-teal-100 hover:text-teal-800 disabled:opacity-50"
                        disabled={busyId === `reminder:${linkedReminder.id}`}
                        onClick={() => void completeReminder(linkedReminder)}
                        title="Complete reminder"
                        type="button"
                      >
                        {busyId === `reminder:${linkedReminder.id}` ? (
                          <LoaderCircle className="animate-spin" size={17} />
                        ) : (
                          <CheckCheck size={17} />
                        )}
                      </button>
                    )}
                    {!isReminder && !item.is_read && (
                      <button
                        aria-label={`Mark ${item.title} as read`}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-teal-100 hover:text-teal-800 disabled:opacity-50"
                        disabled={busyId === item.id}
                        onClick={() => void markAsRead(item)}
                        title="Mark as read"
                        type="button"
                      >
                        {busyId === item.id ? (
                          <LoaderCircle className="animate-spin" size={17} />
                        ) : (
                          <Check size={17} />
                        )}
                      </button>
                    )}
                    {!isReminder && (
                    <button
                      aria-label={`Delete ${item.title}`}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      disabled={busyId === item.id}
                      onClick={() => void deleteNotification(item.id)}
                      title="Delete notification"
                      type="button"
                    >
                      <Trash2 size={17} />
                    </button>
                    )}
                  </div>
                </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default Notification;
