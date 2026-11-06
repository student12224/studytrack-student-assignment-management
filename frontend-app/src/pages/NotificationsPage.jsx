import { useEffect, useState } from "react";
import { Bell, CheckCheck, Clock, Inbox } from "lucide-react";

import {
  getNotifications,
  markNotificationRead,
} from "../services/notificationService.js";

import { getErrorMessage } from "../api.js";

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const notifications = await getNotifications();
        setItems(notifications);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const markRead = async (id) => {
    setMarkingId(id);
    setError("");

    try {
      await markNotificationRead(id);

      setItems((current) =>
        current.map((item) =>
          item._id === id ? { ...item, read: true } : item,
        ),
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setMarkingId(null);
    }
  };

  const unreadCount = items.filter((item) => !item.read).length;

  return (
    <>
      <div className="page-heading">
        <small className="eyebrow">YOUR UPDATES</small>
        <h1>Notifications</h1>
        <p>
          Stay informed about assignments, deadlines and activity in your
          StudyTrack workspace.
        </p>
      </div>

      <section className="surface-card">
        <div className="card-heading">
          <div>
            <small className="eyebrow">NOTIFICATION CENTRE</small>
            <h3>All notifications</h3>
          </div>

          <span className="unread-count">{unreadCount} unread</span>
        </div>

        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <div className="empty-state">Loading notifications...</div>
        ) : items.length > 0 ? (
          items.map((item) => (
            <div className="notification-row" key={item._id}>
              <span className="notification-icon">
                <Bell size={17} />
              </span>

              <div className="notification-content">
                <div className="notification-title">
                  <b>{item.title || "StudyTrack update"}</b>

                  {!item.read && <span className="unread-dot" />}
                </div>

                <p>{item.message}</p>

                <small>
                  <Clock size={12} />
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : "Recently"}
                </small>

                {item.type && (
                  <span className={`notification-type ${item.type}`}>
                    {item.type}
                  </span>
                )}
              </div>

              {!item.read && (
                <button
                  className="button-muted"
                  disabled={markingId === item._id}
                  onClick={() => markRead(item._id)}
                >
                  <CheckCheck size={14} />
                  {markingId === item._id ? "Updating..." : "Mark read"}
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Inbox size={30} />
            <h3>No notifications yet</h3>
            <p>Assignment updates and deadline reminders will appear here.</p>
          </div>
        )}
      </section>
    </>
  );
}
