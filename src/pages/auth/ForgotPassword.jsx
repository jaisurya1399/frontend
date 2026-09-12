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

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      await requestPasswordResetApi(email.trim());
    } catch (error) {
      console.error("Password reset request error:", error);
      // Intentionally ignored: we still show the generic success
      // message below so the response can't reveal whether the
      // email is registered.
    } finally {
      setSuccess(GENERIC_SUCCESS_MESSAGE);
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
              Enter your email and we'll send you a reset link
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
