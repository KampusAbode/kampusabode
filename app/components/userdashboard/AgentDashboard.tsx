
import React from "react";

import ListedProperties from "./ListedProperties";
import StudentReviews from "./StudentReviews";
import AddNewProperty from "./AddNewProperty";
// import Notifications from "./Notifications";
// import PerformanceMetrics from "./PerformanceMetrics";
import { UserType } from "../../fetch/types";

type AgentDashboardProps = {
  user: UserType;
};

const AgentDashboard = ({ user }: AgentDashboardProps) => {
  return (
    <div className="agent-dashboard">
      
      {/* <Notifications user={user} /> */}
      <ListedProperties user={user} />
      <StudentReviews user={user} />
      <AddNewProperty />
      {/* <PerformanceMetrics user={user} /> */}
    </div>
  );
};

export default AgentDashboard;
