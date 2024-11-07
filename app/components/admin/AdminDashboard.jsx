import UserManagement from "./UserManagement";
import PropertyManagement from "./PropertyManagement";
import ReviewManagement from "./ReviewManagement";
import Analytics from "./Analytics";
import Notifications from "./Notifications";

const AdminDashboard = () => {
  return (
    <div className="admin">
      <h3>Admin Portal</h3>
        <Notifications />
        <UserManagement />
        <PropertyManagement />
        <ReviewManagement />
        <Analytics />
    </div>
  );
};

export default AdminDashboard;
