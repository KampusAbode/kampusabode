// import React from 'react'
import { UserType } from "../../fetch/types"

function AgentPerformanceMetrics({user}) {
  return (
    <div className="agent-matrics">
      <div>
        {/* {user?.}  */}
        {user?.userType === "agent"
          ? user?.userInfo.propertiesListed.length.toString()
          : 0}
        <span>apartment listed</span>
      </div>
      
      
    </div>
  );
}

export default AgentPerformanceMetrics
