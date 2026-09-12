import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
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
import { Link } from "react-router-dom";

import { requestPasswordResetApi } from "../../api/authApi";
import {
  BORDER,
  CANVAS_BACKGROUND,
  ELEVATION_SHADOW,
  PRIMARY,
  RADIUS,
  SURFACE,
} from "../../theme/colors";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Generic message shown regardless of whether the account exists,
  // so this endpoint can't be used to enumerate registered emails.
  const GENERIC_SUCCESS_MESSAGE =
    "If an account exists for that email, we've sent a password reset link. Please check your inbox.";

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email.");
      return;
    }

    // Browser-level email validation with a clear message.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await requestPasswordResetApi(normalizedEmail);

      // 204 No Content is the expected successful response from the
      // backend for a password-reset request.
      if (response?.status === 204 || response?.status === 200) {
        setSuccess(GENERIC_SUCCESS_MESSAGE);
      } else {
        setError(
          "Unable to process the password reset request. Please try again.",
        );
      }
    } catch (error) {
      console.error("Password reset request error:", error);

      const status = error.response?.status;
      const serverMessage =
        error.response?.data?.message || error.response?.data?.error;

      if (status === 429) {
        setError("Too many reset requests. Please wait and try again later.");
      } else if (status >= 500) {
        setError(
          "Password reset service is temporarily unavailable. Please try again later.",
        );
      } else if (error.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to the backend. Make sure Spring Boot is running.",
        );
      } else if (serverMessage) {
        setError(serverMessage);
      } else {
        setError(
          "Unable to process the password reset request. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

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
              <MarkEmailReadOutlinedIcon fontSize="large" />
            </Box>

            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                marginTop: 2,
              }}
            >
              Forgot Password
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                marginTop: 0.5,
              }}
            >
              Enter your registered email and we'll send you a secure reset link
            </Typography>
          </Box>

          {/* Error */}
          {error && (
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Success */}
          {success && <Alert severity="success">{success}</Alert>}

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
              "Send Reset Link"
            )}
          </Button>

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
