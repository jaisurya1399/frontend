import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
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
import { Link, useNavigate } from "react-router-dom";

import { signupApi } from "../../api/authApi";
import {
  BORDER,
  CANVAS_BACKGROUND,
  ELEVATION_SHADOW,
  PRIMARY,
  RADIUS,
  SURFACE,
} from "../../theme/colors";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await signupApi({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1200);
    } catch (error) {
      console.error("Signup error:", error);

      const message = error.response?.data?.message;

      if (message) {
        setError(message);
      } else if (error.response?.status === 409) {
        setError("An account with this email already exists.");
      } else if (error.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to backend. Make sure Spring Boot is running.",
        );
      } else {
        setError("Signup failed. Please try again.");
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
        <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
          <Box sx={{ textAlign: "center" }}>
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
              <PersonAddOutlinedIcon fontSize="large" />
            </Box>

            <Typography variant="h4" fontWeight={800} sx={{ marginTop: 2 }}>
              Create Account
            </Typography>

            <Typography color="text.secondary">
              Join Project Management
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {success && <Alert severity="success">{success}</Alert>}

          <TextField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
            autoFocus
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="email"
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="new-password"
            helperText="Minimum 6 characters"
          />

          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{ height: 48 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Account"
            )}
          </Button>

          <Typography textAlign="center" color="text.secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: PRIMARY,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
