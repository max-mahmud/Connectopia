import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtechUser = () => {
  const { token } = useSelector((state) => state.user);

  if (token) {
    return <Outlet />;
  } else {
    return <Navigate to={"/login"} replace={true} />;
  }
};

export default ProtechUser;
