import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
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
import { useLocation, useNavigate } from "react-router-dom";
import { verifyMfaApi } from "../../api/authApi";
import { CURRENT_USER_KEY, persistAuthTokens } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function MfaVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeLogin } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const mfaToken = location.state?.mfaToken;
  const email = location.state?.email || "your account";

  if (!mfaToken) {
    navigate("/login", { replace: true });
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter the 6-digit code from your authenticator app.");
      return;
    }
    setLoading(true);
    try {
      const data = await verifyMfaApi(mfaToken, code.trim());
      persistAuthTokens(data);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data));
      completeLogin(data);
      const role = data?.role?.toUpperCase();
      navigate(role === "ADMIN" ? "/admin" : "/developer", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired MFA code.");
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
        p: 2,
      }}
    >
      <Paper sx={{ width: "100%", maxWidth: 430, p: 4 }}>
        <Stack spacing={3} component="form" onSubmit={submit}>
          <Box sx={{ textAlign: "center" }}>
            <LockOutlinedIcon color="primary" sx={{ fontSize: 48 }} />
            <Typography variant="h5" fontWeight={800}>
              Two-factor authentication
            </Typography>
            <Typography color="text.secondary">
              Enter the 6-digit code for {email}.
            </Typography>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Authentication code"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            inputProps={{ inputMode: "numeric", maxLength: 6 }}
            autoFocus
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Verify & Sign In"
            )}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
