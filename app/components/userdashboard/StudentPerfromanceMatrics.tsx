import React from "react";

function StudentPerfromanceMatrics({ user }) {
  return (
    <div className="student-matrics">
      <div className="matric">
        <h6>
          {user?.userType === "student"
            ? user?.userInfo.savedProperties.length
            : 0}
        </h6>
        <p>saved properties</p>
      </div>
      <div className="matric">
        <h6>
          {user?.userType === "student"
            ? user?.userInfo.viewedProperties.length
            : 0}
        </h6>
        <p>viewed properties</p>
      </div>
      <div className="matric">
        <h6>
          {user?.userType === "student"
            ? user?.userInfo.wishlist.length
            : 0}
        </h6>
        <p>wishlist</p>
      </div>
    </div>
  );
}

export default StudentPerfromanceMatrics;
