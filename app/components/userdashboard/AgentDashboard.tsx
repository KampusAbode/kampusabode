import React from "react";

import ListedProperties from "./ListedProperties";
import StudentReviews from "./StudentReviews";
import AgentPerformanceMetrics from "./AgentPerformanceMetrics";
import { UserType } from "../../fetch/types";

type AgentDashboardProps = {
  user: UserType;
};

const AgentDashboard = ({ user }: AgentDashboardProps) => {
  return (
    <div className="agent-dashboard">
      {/* <Notifications user={user} /> */}
      {/* <AgentMatrics user={user} /> */}

      <AgentPerformanceMetrics />
      <ListedProperties />
      <StudentReviews />
    </div>
  );
};

export default AgentDashboard;
