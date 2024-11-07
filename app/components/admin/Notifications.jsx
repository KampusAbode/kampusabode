
const Notifications = () => {
  const notifications = [
    { id: 1, message: "New student registration!" },
    { id: 2, message: "A new property has been listed." },
  ];

  return (
    <div className="notifications">
      <h3>Notifications</h3>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
