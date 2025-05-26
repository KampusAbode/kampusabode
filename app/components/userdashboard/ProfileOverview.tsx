import React from "react";
import Image from "next/image";
import { UserType } from "../../fetch/types";
import { useUserStore } from "../../store/userStore";
import { MdVerified, MdErrorOutline } from "react-icons/md";

const ProfileOverview = ({userdata}) => {
  const { user } = useUserStore((state) => state);

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
          <span>
            Email: {user?.email}{" "}
            {userdata.emailVerified ? (
              <span className="verified">
                <MdVerified size={20} color="#2ecc71" title="Verified" />
              </span>
            ) : (
              <span className="not-verified">
                <MdErrorOutline
                  size={20}
                  color="#e74c3c"
                  title="Not Verified"
                />
              </span>
            )}
          </span>
          <span>Phone: {user?.phoneNumber}</span>
          <span>University: {user?.university}</span>
          <span>Status: {user?.userType}</span>
          {user?.userType === "student" && "department" in user.userInfo ? (
            <span>Department: {user?.userInfo?.department}</span>
          ) : (
            ""
          )}
          {user?.userType === "agent" && "agencyName" in user.userInfo ? (
            <span>Department: {user?.userInfo?.agencyName}</span>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
