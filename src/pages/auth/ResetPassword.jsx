import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
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
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { confirmPasswordResetApi } from "../../api/authApi";
import {
  BORDER,
  CANVAS_BACKGROUND,
  ELEVATION_SHADOW,
  PRIMARY,
  RADIUS,
  SURFACE,
} from "../../theme/colors";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!password) {
      setError("Please enter a new password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordResetApi(token, password);
      setSuccess(true);
    } catch (error) {
      console.error("Password reset confirm error:", error);

      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400 || status === 404) {
        setError(
          "This reset link is invalid or has expired. Please request a new one.",
        );
      } else if (error.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to backend. Make sure Spring Boot is running.",
        );
      } else if (message) {
        setError(message);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------
  // Missing / invalid token — no point showing a broken form
  // --------------------------------------------------------
  const missingToken = !token;

  return (
    <Box
      className="auth-password-reset"
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
        <Stack
          spacing={3}
          component={missingToken || success ? "div" : "form"}
          onSubmit={missingToken || success ? undefined : handleSubmit}
        >
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
              <LockResetOutlinedIcon fontSize="large" />
            </Box>

            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                marginTop: 2,
              }}
            >
              Reset Password
            </Typography>

            {!missingToken && !success && (
              <Typography
                color="text.secondary"
                sx={{
                  marginTop: 0.5,
                }}
              >
                Choose a new password for your account
              </Typography>
            )}
          </Box>

          {/* Missing token state */}
          {missingToken ? (
            <>
              <Alert severity="error">
                This reset link is missing or invalid. Please request a new
                password reset link.
              </Alert>

              <Button
                component={Link}
                to="/forgot-password"
                variant="contained"
                size="large"
                fullWidth
                sx={{ height: 48, fontSize: "1rem", fontWeight: 600 }}
              >
                Request New Link
              </Button>
            </>
          ) : success ? (
            <>
              <Alert severity="success">
                Your password has been reset successfully. You can now sign in
                with your new password.
              </Alert>

              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                fullWidth
                sx={{ height: 48, fontSize: "1rem", fontWeight: 600 }}
              >
                Go to Sign In
              </Button>
            </>
          ) : (
            <>
              {/* Error */}
              {error && (
                <Alert severity="error" onClose={() => setError("")}>
                  {error}
                </Alert>
              )}

              {/* New Password */}
              <TextField
                label="New Password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                fullWidth
                autoFocus
                autoComplete="new-password"
                helperText="Minimum 6 characters"
                disabled={loading}
              />

              {/* Confirm Password */}
              <TextField
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                fullWidth
                autoComplete="new-password"
                disabled={loading}
              />

              {/* Submit Button */}
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
                  "Reset Password"
                )}
              </Button>
            </>
          )}

          {/* Back to Login */}
          <Typography textAlign="center" color="text.secondary">
            Remembered your password?{" "}
            <Link
              to="/login"
              style={{
                color: PRIMARY,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Back to Sign In
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
