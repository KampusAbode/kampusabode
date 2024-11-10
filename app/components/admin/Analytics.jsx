// "use client";

// import { useEffect, useState } from "react";
// import { fetchAnalytics } from "../../utils/api";

// const Analytics = () => {
//   const [data, setData] = useState({});

//   useEffect(() => {
//     const fetchAnalyticsData = async () => {
//       try {
//         const analyticsData = await fetchAnalytics();
//         setData(analyticsData);
//       } catch (error) {
//         console.error(error.message);
//       }
//     };
//     fetchAnalyticsData();
//   }, []);

//   return (
//     <div className="analytics">
//       <h4>Analytics</h4>
//       <p>Total Users: {data.totalUsers}</p>
//       <p>Total Properties Listed: {data.totalProperties}</p>
//       {/* Display more analytics as needed */}
//     </div>
//   );
// };

// export default Analytics;
