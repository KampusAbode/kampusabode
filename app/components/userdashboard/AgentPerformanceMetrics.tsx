// import React from 'react'
import { UserType } from "../../fetch/types"

function AgentPerformanceMetrics({user}) {
  return (
    <div className="agent-matrics">
      <div className="matric">
        {user?.userType === "agent"
          ? (user?.userInfo.propertiesListed?.length ?? 0).toString()
          : 0}
        <span>listed</span>
      </div>
      <div className="matric">
        {user?.userType === "agent"
          ? (user?.userInfo.propertiesSold?.length ?? 0).toString()
          : 0}
        <span>sold</span>
      </div>
      <div className="matric">
        {user?.userType === "agent"
          ? (user.userInfo?.reviews?.length ?? 0).toString()
          : 0}
        <span>reviews</span>
      </div>
    </div>
  );
}

export default AgentPerformanceMetrics
