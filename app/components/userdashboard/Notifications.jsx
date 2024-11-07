// import { useSelector } from "react-redux"; // If using Redux
// // import { useEffect, useState } from "react"; // For fetching from backend

// const Notifications = (user) => {
//   // Example if you're fetching from state (e.g., Redux):
//   const notifications = useSelector((state) => state.notifications.items);

//   // // For local state or fetching from a backend (replace with actual API call):
//   // const [notifications, setNotifications] = useState([]);

//   // useEffect(() => {
//   //   // Fetch notifications from your backend or API
//   //   const fetchNotifications = async () => {
//   //     // Simulate an API call
//   //     const response = await new Promise((resolve) =>
//   //       setTimeout(
//   //         () =>
//   //           resolve([
//   //             {
//   //               id: 1,
//   //               message: "You have a new review on your property!",
//   //               timestamp: "2024-09-16T10:30:00",
//   //             },
//   //             {
//   //               id: 2,
//   //               message: "A new property has been added in your area.",
//   //               timestamp: "2024-09-15T14:45:00",
//   //             },
//   //           ]),
//   //         1000
//   //       )
//   //     );
//   //     setNotifications(response);
//   //   };

//   //   fetchNotifications();
//   // }, []); // Run on component mount

//   return (
//     <div className="notifications">
//       <h3>Notifications</h3>
//       {notifications.length > 0 ? (
//         <ul>
//           {notifications.map((notification) => (
//             <li key={notification.id}>
//               {notification.message}
//               <br />
//               <small>{new Date(notification.timestamp).toLocaleString()}</small>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No new notifications.</p>
//       )}
//     </div>
//   );
// };

// export default Notifications;
