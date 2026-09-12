import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  confirmEmailVerificationApi,
  resendEmailVerificationApi,
} from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import {
  BORDER,
  CANVAS_BACKGROUND,
  ELEVATION_SHADOW,
  PRIMARY,
  RADIUS,
  SURFACE,
} from "../../theme/colors";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { user } = useAuth();

  // "pending" | "success" | "error"
  const [status, setStatus] = useState(token ? "pending" : "missing-token");
  const [error, setError] = useState("");

  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  // Guard against React 18/19 StrictMode double-invoking effects,
  // which would otherwise fire the confirm request twice.
  const hasConfirmed = useRef(false);

  useEffect(() => {
    if (!token || hasConfirmed.current) {
      return;
    }

    hasConfirmed.current = true;

    confirmEmailVerificationApi(token)
      .then(() => {
        setStatus("success");
      })
      .catch((err) => {
        console.error("Email verification error:", err);

        const message = err.response?.data?.message;

        setError(
          message ||
            "This verification link is invalid or has expired. Please request a new one.",
        );
        setStatus("error");
      });
  }, [token]);

  const handleResend = async () => {
    if (resending) {
      return;
    }

    setResending(true);
    setResendMessage("");

    try {
      await resendEmailVerificationApi();
      setResendMessage("A new verification email has been sent.");
    } catch (err) {
      console.error("Resend verification error:", err);

      const message = err.response?.data?.message;

      setResendMessage(
        message || "Failed to resend verification email. Please try again.",
      );
    } finally {
      setResending(false);
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
        <Stack spacing={3}>
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
              <MarkEmailUnreadOutlinedIcon fontSize="large" />
            </Box>

            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                marginTop: 2,
              }}
            >
              Verify Email
            </Typography>
          </Box>

          {/* Pending */}
          {status === "pending" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                py: 2,
              }}
            >
              <CircularProgress />
              <Typography color="text.secondary">
                Verifying your email address...
              </Typography>
            </Box>
          )}

          {/* Missing token */}
          {status === "missing-token" && (
            <Alert severity="error">
              This verification link is missing or invalid. Please use the link
              from your verification email, or resend it below.
            </Alert>
          )}

          {/* Success */}
          {status === "success" && (
            <Alert severity="success">
              Your email address has been verified successfully.
            </Alert>
          )}

          {/* Error */}
          {status === "error" && <Alert severity="error">{error}</Alert>}

          {/* Resend result */}
          {resendMessage && <Alert severity="info">{resendMessage}</Alert>}

          {/* Resend button — only available for a logged-in user, since
              the resend endpoint requires an authenticated session. */}
          {(status === "error" || status === "missing-token") &&
            (user ? (
              <Button
                variant="outlined"
                fullWidth
                disabled={resending}
                onClick={handleResend}
                sx={{ height: 44 }}
              >
                {resending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Resend Verification Email"
                )}
              </Button>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Please sign in to resend the verification email.
              </Typography>
            ))}

          {/* Navigation */}
          {status === "success" ? (
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
          ) : (
            <Typography textAlign="center" color="text.secondary">
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
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
