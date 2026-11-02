"use client";

import { useNotifications } from "../../context/NotificationContext";
import IconButton from "../button/IconButton";
import { X } from "lucide-react";

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
              <IconButton
                aria-label="Delete notification"
                onClick={() => deleteNotification(notification.id)}>
                <X size={20} strokeWidth={1.75} aria-hidden="true" />
              </IconButton>
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
