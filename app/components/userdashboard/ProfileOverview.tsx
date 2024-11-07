import React from "react";
import Image from "next/image";
import { AgentType, StudentType } from "../../fetch/types";

const ProfileOverview = ({ user }: { user: AgentType | StudentType }) => {
  return (
    <div className="profile-overview">
      <div className="dt">
        <div className="img">
          <Image
            src={"/assets/person3.jpg"}
            width={800}
            height={800}
            alt="profile picture"
          />
        </div>
        <div className="tdt">
          <span>Name: {user.name}</span>
          <span>Email: {user.email}</span>
          <span>
            Phone:{" "}
            {!user.userInfo.phoneNumber ? "Null" : user.userInfo.phoneNumber}
          </span>
          <span>Status: {user.userType}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
