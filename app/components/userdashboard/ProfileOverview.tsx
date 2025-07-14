import React from "react";
import Image from "next/image";
import { UserType } from "../../fetch/types";
import { useUserStore } from "../../store/userStore";
import { MdVerified, MdErrorOutline } from "react-icons/md";
import { RiCloseCircleLine, RiVerifiedBadgeLine } from "react-icons/ri";

const ProfileOverview = ({userdata}) => {
  const { user } = useUserStore((state) => state);

  return (
    <div className="profile-overview">
      <div className="dt">
        <div className="img">
          <Image
            priority
            src={user?.avatar || "/assets/user.svg"}
            width={1500}
            height={1500}
            alt="profile picture"
          />
        </div>
        <div className="tdt">
          <span>
            <strong>Name:</strong> {user?.name}
          </span>
          <span>
            <strong>Email:</strong> {user?.email}{" "}
            {userdata.emailVerified ? (
              <span className="verified">
                <RiVerifiedBadgeLine title="Verified" />
              </span>
            ) : (
              <span className="not-verified">
                <RiCloseCircleLine title="Not Verified" />
              </span>
            )}
          </span>
          <span>
            <strong>Phone:</strong> {user?.phoneNumber}
          </span>
          <span>
            <strong>University:</strong> {user?.university}
          </span>
          <span>
            <strong>Status:</strong> {user?.userType}
          </span>
          {user?.userType === "student" && "department" in user.userInfo ? (
            <span>
              <strong>Department:</strong> {user?.userInfo?.department}
            </span>
          ) : (
            ""
          )}
          {user?.userType === "agent" && "agencyName" in user.userInfo ? (
            <span>
              <strong>Agency:</strong> {user?.userInfo?.agencyName}
            </span>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
