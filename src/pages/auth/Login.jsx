import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { useAuth } from "../../context/AuthContext";
import {
  BORDER,
  CANVAS_BACKGROUND,
  ELEVATION_SHADOW,
  PRIMARY,
  RADIUS,
  SURFACE,
} from "../../theme/colors";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const loggedInUser = await login(email.trim(), password);

      if (loggedInUser?.mfaRequired && loggedInUser?.mfaToken) {
        navigate("/mfa-verify", {
          replace: true,
          state: { mfaToken: loggedInUser.mfaToken, email: loggedInUser.email },
        });
        return;
      }

      const role = loggedInUser?.role?.toUpperCase();

      if (role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/developer", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);

      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 401) {
        setError("Invalid email or password.");
      } else if (status === 403) {
        setError("You are not authorized to login.");
      } else if (status === 404) {
        setError("Login API was not found. Please check the backend.");
      } else if (error.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to backend. Make sure Spring Boot is running on port 8080.",
        );
      } else if (message) {
        setError(message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        backgroundColor: CANVAS_BACKGROUND,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 430,
          padding: 4,
          borderRadius: `${RADIUS.card}px`,
          backgroundColor: SURFACE,
          border: `1px solid ${BORDER}`,
          boxShadow: ELEVATION_SHADOW,
        }}
      >
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          {/* Header */}
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                margin: "0 auto",

                borderRadius: 3,

                backgroundColor: "primary.main",

                color: "#ffffff",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LockOutlinedIcon fontSize="large" />
            </Box>

            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                marginTop: 2,
              }}
            >
              Welcome Back
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                marginTop: 0.5,
              }}
            >
              Sign in to Project Management
            </Typography>
          </Box>

          {/* Error */}
          {error && (
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Email */}
          <TextField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            fullWidth
            autoFocus
            autoComplete="email"
            placeholder="Enter your email"
          />

          {/* Password */}
          <TextField
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            fullWidth
            autoComplete="current-password"
            placeholder="Enter your password"
          />

          {/* Forgot Password Link */}
          <Box sx={{ textAlign: "right", marginTop: -1.5 }}>
            <Link
              to="/forgot-password"
              style={{
                color: PRIMARY,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              Forgot password?
            </Link>
          </Box>

          {/* Login Button */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{
              height: 48,
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Signup Link */}
          <Typography textAlign="center" color="text.secondary">
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: PRIMARY,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Create Account
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
