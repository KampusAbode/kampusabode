import React from "react";
import Image from "next/image";
import { UserType } from "../../fetch/types";

const ProfileOverview = ({ user }: { user: UserType }) => {
  console.log(user);
  
  return (
    <div className="profile-overview">
      <div className="dt">
        <div className="img">
          <Image
            priority
            src={user?.avatar || "/assets/person3.jpg"}
            width={1000}
            height={1000}
            alt="profile picture"
          />
        </div>
        <div className="tdt">
          <span>Name: {user?.name}</span>
          <span>Email: {user?.email}</span>
          <span>Phone: {user?.phoneNumber}</span>
          <span>University: {user?.university}</span>
          <span>Status: {user?.userType}</span>
          {user?.userType === "student" && "department" in user.userInfo ? (
            <span>Department: user?.userInfo?.department</span>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
