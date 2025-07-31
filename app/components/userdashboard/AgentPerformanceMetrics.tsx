// import React from 'react'
import { useUserStore } from "@/app/store/userStore";
import { UserType } from "../../fetch/types"

function AgentPerformanceMetrics() {
  const user = useUserStore((state) => state.user);
  return (
    <div className="agent-matrics">
      <div className="matric">
        {user?.userType === "agent" && "propertiesListed" in (user.userInfo ?? {})
          ? ((user.userInfo as any).propertiesListed?.length ?? 0).toString()
          : 0}
        <span>listed</span>
      </div>
      <div className="matric">
        {user?.userType === "agent" && "propertiesSold" in (user.userInfo ?? {})
          ? ((user.userInfo as any).propertiesSold?.length ?? 0).toString()
          : 0}
        <span>sold</span>
      </div>
      <div className="matric">
        {user?.userType === "agent" && "reviews" in (user.userInfo ?? {})
          ? ((user.userInfo as any).reviews?.length ?? 0).toString()
          : 0}
        <span>reviews</span>
      </div>
    </div>
  );
}

export default AgentPerformanceMetrics
