// import React from 'react'
import { UserType } from "../../fetch/types"

function AgentPerformanceMetrics({user}) {
  return (
    <div className="agent-matrics">
      <div className="matric">
        {/* {user?.}  */}
        {user?.userType === "agent"
          ? user?.userInfo.propertiesListed.length.toString()
          : 0}
        <span>apartment listed</span>
      </div>
      <div className="matric">
        {user?.userType === "agent"
          ? user?.userInfo.propertiesSold.length.toString()
          : 0}
        <span>apartment sold</span>
      </div>
      <div className="matric">
        {user?.userType === "agent"
          ? user?.userInfo.reviews.length.toString()
          : 0}
        <span>reviews</span>
      </div>
      
      
      
    </div>
  );
}

export default AgentPerformanceMetrics
