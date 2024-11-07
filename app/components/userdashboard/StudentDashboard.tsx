// components/Dashboard/StudentDashboard.js

import BookmarkedProperties from "./BookmarkedProperties";
import RecentReviews from "./RecentReviews";
import ViewedProperties from "./ViewedProperties"
import { StudentType } from "../../fetch/types";
// import AvailableProperties from "./AvailableProperties";
// import Notifications from "./Notifications";


type StudentDashboardProps = {
  user: StudentType,
};

const StudentDashboard = ({ user }: StudentDashboardProps) => {
  return (
    <div className="student-dashboard">
      

      {/* <Notifications user={user} /> */}

      <BookmarkedProperties user={user} />

      <RecentReviews user={user} />

      <ViewedProperties/>

    </div>
  );
};

export default StudentDashboard;
