import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

   if (
    !user ||
    (
      user.role !== "admin" &&
      user.role !== "superadmin"
    )
  ) {
    return <Navigate to="/admin/login" />;
  }

  // ✅ allow
  return children;
};


export default AdminRoute;
