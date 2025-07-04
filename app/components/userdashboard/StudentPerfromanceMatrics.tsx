import React from 'react'

function StudentPerfromanceMatrics({user}) {
  return (
    <div className='student-matrics'>
      <div>
        {user?.userType === "student"
          ? user?.userInfo.savedProperties.length.toString()
          : 0}
        <span>saved properties</span>
      </div>
      <div>
        {user?.userType === "student"
          ? user?.userInfo.viewedProperties.length.toString()
          : 0}
        <span>viewed properties</span>
      </div>
      <div>
        {user?.userType === "student"
          ? user?.userInfo.wishlist.length.toString()
          : 0}
        <span>wishlist</span>
      </div> 
    </div>
  )
}

export default StudentPerfromanceMatrics
