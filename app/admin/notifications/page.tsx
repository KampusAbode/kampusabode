"use client";

import { useNotifications } from "../../context/NotificationContext";

const Notifications = () => {
  // Directly extract notifications and deleteNotification from the context
  const { notifications, deleteNotification } = useNotifications();

  return (
    <div className="notifications">
      <ul>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <li key={notification.id} className="notification-item">
              {notification.message}
              <button onClick={() => deleteNotification(notification.id)}>
                ❌
              </button>
            </li>
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "5rem" }}>
            No recent updates.
          </p>
        )}
      </ul>
    </div>
  );
};

export default Notifications;
