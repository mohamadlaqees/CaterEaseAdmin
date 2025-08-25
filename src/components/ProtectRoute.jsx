import { Navigate } from "react-router";
const ProtectRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to={"/login"} />;
};

export default ProtectRoute;
