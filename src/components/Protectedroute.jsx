import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();

  const savedUser = localStorage.getItem("loggedInUser");

  // User is not logged in
  if (!savedUser) {
    const redirectPath =
      location.pathname + location.search;

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
        replace
      />
    );
  }

  let user;

  try {
    user = JSON.parse(savedUser);
  } catch (error) {
    localStorage.removeItem("loggedInUser");

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(
          location.pathname
        )}`}
        replace
      />
    );
  }

  // Role-based protection
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;