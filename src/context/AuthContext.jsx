import { createContext, useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { getCurrentUserApi, loginApi, logoutApi } from "../api/authApi";

import {
  ACCESS_TOKEN_KEY,
  CURRENT_USER_KEY,
  clearAuthStorage,
  persistAuthTokens,
} from "../api/axios";

const AuthContext = createContext(null);

export { ACCESS_TOKEN_KEY, CURRENT_USER_KEY };

// ============================================================
// AUTH PROVIDER
// ============================================================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ==========================================================
  // RESTORE LOGIN SESSION
  // ==========================================================

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    const storedUser = localStorage.getItem(CURRENT_USER_KEY);

    // --------------------------------------------------------
    // No token = not logged in
    // --------------------------------------------------------

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // --------------------------------------------------------
    // Restore cached user immediately
    // --------------------------------------------------------

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);
      } catch (error) {
        console.error("AUTH: Failed to parse stored user:", error);

        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }

    // --------------------------------------------------------
    // Validate / refresh current user from backend
    // --------------------------------------------------------

    getCurrentUserApi()
      .then((data) => {
        if (!data) {
          throw new Error("Current user response is empty");
        }

        setUser(data);

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data));
      })
      .catch((error) => {
        console.error("AUTH: Failed to restore session:", error);

        /*
         * IMPORTANT:
         *
         * If we already have a cached user, don't
         * immediately destroy the session because a
         * temporary API/network failure should not kick
         * the user to login.
         */

        if (!storedUser) {
          clearAuthStorage();

          setUser(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ==========================================================
  // LOGIN
  // ==========================================================

  const completeLogin = (data) => {
    persistAuthTokens(data);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data));
    setUser(data);
    return data;
  };

  const login = async (email, password) => {
    const data = await loginApi(email, password);

    if (data?.mfaRequired) {
      return data;
    }

    // --------------------------------------------------------
    // Save access + refresh tokens
    // --------------------------------------------------------

    persistAuthTokens(data);

    // --------------------------------------------------------
    // Save complete user/login response
    // --------------------------------------------------------

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data));

    setUser(data);

    return data;
  };

  const isSystemAdmin = () => user?.role?.toUpperCase() === "ADMIN";

  const getProjectMembership = (projectId) => {
    if (isSystemAdmin())
      return { role: "PROJECT_ADMIN", responsibilityRole: null };
    return (
      (user?.projectMemberships || []).find(
        (membership) => Number(membership.projectId) === Number(projectId),
      ) || null
    );
  };

  const hasProjectRole = (projectId, roles = []) => {
    if (isSystemAdmin()) return true;
    const membership = getProjectMembership(projectId);
    return (
      !!membership &&
      roles
        .map((r) => r.toUpperCase())
        .includes(String(membership.role).toUpperCase())
    );
  };

  const hasResponsibility = (projectId, responsibilities = []) => {
    if (isSystemAdmin()) return true;
    const membership = getProjectMembership(projectId);
    return (
      !!membership &&
      String(membership.role).toUpperCase() === "MEMBER" &&
      responsibilities
        .map((r) => r.toUpperCase())
        .includes(String(membership.responsibilityRole || "").toUpperCase())
    );
  };

  const hasPermission = (permission) => {
    if (!permission) return true;
    if (isSystemAdmin()) return true;

    const required = String(permission).trim().toLowerCase();
    if (!required) return true;

    const permissions = Array.isArray(user?.permissions)
      ? user.permissions
      : [];

    return permissions.some((value) => {
      const granted = String(value || "")
        .trim()
        .toLowerCase();
      return (
        granted === required ||
        granted === "*" ||
        granted === "all" ||
        (granted.endsWith(".*") && required.startsWith(granted.slice(0, -1)))
      );
    });
  };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Still clear local session.
    }

    clearAuthStorage();

    setUser(null);

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================================
  // CONTEXT
  // ==========================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        completeLogin,
        hasPermission,
        isSystemAdmin,
        getProjectMembership,
        hasProjectRole,
        hasResponsibility,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// USE AUTH
// ============================================================

export const useAuth = () => {
  return useContext(AuthContext);
};
