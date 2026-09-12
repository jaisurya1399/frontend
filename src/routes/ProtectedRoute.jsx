import { Navigate, Outlet, useLocation } from "react-router-dom";

import { Box, CircularProgress } from "@mui/material";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles, allowedPermissions }) {
  const { user, loading, hasPermission } = useAuth();
  const location = useLocation();

  // Wait until AuthContext restores the session
  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Normal authentication-only protected route
  if (!allowedRoles || allowedRoles.length === 0) {
    return <Outlet />;
  }

  // Get logged-in user's role
  const userRole = String(user?.role || "").toUpperCase();
  const hasAccess = allowedRoles.some(
    (role) => String(role || "").toUpperCase() === userRole,
  );

  const hasRequiredPermission =
    !allowedPermissions?.length || allowedPermissions.some(hasPermission);

  if (!hasAccess || !hasRequiredPermission) {
    // Redirect user to their own dashboard
    if (userRole === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    // All non-system-admin users use the project workspace. Their
    // project access is PROJECT_ADMIN / MEMBER / VIEWER.
    return <Navigate to="/developer" replace />;
  }

  return <Outlet />;
}
