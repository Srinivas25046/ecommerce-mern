import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = () => {
  const { userInfo } = useContext(AuthContext);
  return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;