import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/* ---------------------------------------------------------
   Design tokens — refined, professional, editorial
--------------------------------------------------------- */
const INK = "#101223";
const SLATE = "#1C1F33";
const GOLD = "#C8A15A";
const GOLD_SOFT = "rgba(200,161,90,0.16)";
const PAPER = "#F7F6F2";
const CARD = "#FFFFFF";
const TEXT_INK = "#181A2E";
const TEXT_MUTED = "#71727F";
const HAIRLINE = "rgba(24,26,46,0.10)";
const DISPLAY_FONT = "'Fraunces', Georgia, serif";
const UI_FONT = "'Inter', 'Work Sans', system-ui, sans-serif";

const KEYFRAMES = `
  @keyframes glowIn {
    0%   { opacity: 0; transform: scale(0.75); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes arcIn {
    to { stroke-dashoffset: 0; }
  }
  @keyframes lineIn {
    to { transform: scaleX(1); }
  }
  @keyframes twinkle {
    0%, 100% { opacity: 0.1; }
    50%      { opacity: 0.55; }
  }
  @keyframes breathe {
    0%, 100% { transform: scale(1);    opacity: 0.35; }
    50%      { transform: scale(1.08); opacity: 0.55; }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(5px); }
    60%      { transform: translateX(-3px); }
    80%      { transform: translateX(2px); }
  }
  @keyframes popIn {
    0%   { transform: scale(0.5); opacity: 0; }
    70%  { transform: scale(1.12); }
    100% { transform: scale(1);   opacity: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    .lp-anim { animation: none !important; opacity: 1 !important; transform: none !important; }
  }
`;

/* ---------------------------------------------------------
   Night panel — quiet, premium dusk
--------------------------------------------------------- */
function NightScene() {
  const stars = [
    { cx: 70, cy: 60, r: 1.2, d: 0 },
    { cx: 160, cy: 36, r: 0.9, d: 0.9 },
    { cx: 230, cy: 84, r: 1.3, d: 1.7 },
    { cx: 310, cy: 48, r: 1, d: 0.5 },
    { cx: 366, cy: 110, r: 1.1, d: 2.2 },
    { cx: 110, cy: 140, r: 0.9, d: 1.3 },
    { cx: 335, cy: 168, r: 1.2, d: 2.6 },
  ];
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox="0 0 420 420"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="lpGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.55" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lpBg" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor={INK} />
            <stop offset="100%" stopColor={SLATE} />
          </linearGradient>
        </defs>

        <rect width="420" height="420" fill="url(#lpBg)" />

        {stars.map((s, i) => (
          <circle
            key={i}
            className="lp-anim"
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="#EDE9DF"
            style={{ animation: `twinkle 5.5s ease-in-out ${s.d}s infinite` }}
          />
        ))}

        <circle
          className="lp-anim"
          cx="210"
          cy="150"
          r="110"
          fill="url(#lpGlow)"
          style={{ animation: "breathe 7s ease-in-out 1.6s infinite" }}
        />
        <circle
          className="lp-anim"
          cx="210"
          cy="150"
          r="24"
          fill={GOLD}
          style={{
            transformOrigin: "210px 150px",
            animation: "glowIn 1.6s cubic-bezier(0.16,1,0.3,1) 0.3s both",
          }}
        />

        <path
          className="lp-anim"
          d="M 100 210 A 115 115 0 0 1 320 210"
          fill="none"
          stroke="rgba(200,161,90,0.25)"
          strokeWidth="1"
          strokeDasharray="420"
          strokeDashoffset="420"
          style={{ animation: "arcIn 2.4s ease-out 0.3s forwards" }}
        />
        <line
          className="lp-anim"
          x1="0"
          y1="210"
          x2="420"
          y2="210"
          stroke="rgba(200,161,90,0.35)"
          strokeWidth="1"
          style={{
            transformOrigin: "center",
            transform: "scaleX(0)",
            animation: "lineIn 1.2s ease-out 1.5s forwards",
          }}
        />
      </svg>
    </Box>
  );
}

/* ---------------------------------------------------------
   PlanoraMark — premium gold monogram (V1 logo style)
--------------------------------------------------------- */
function PlanoraMark({ color = PAPER, size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden>
      <defs>
        <linearGradient id="pmGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D78E" />
          <stop offset="50%" stopColor={GOLD} />
          <stop offset="100%" stopColor="#8C6D1F" />
        </linearGradient>
      </defs>

      {/* outer premium ring */}
      <circle
        cx="17"
        cy="17"
        r="15.5"
        stroke="url(#pmGold)"
        strokeWidth="1.6"
      />
      <circle
        cx="17"
        cy="17"
        r="12.5"
        stroke={GOLD}
        strokeWidth="0.6"
        opacity="0.45"
      />

      {/* layered P monogram */}
      <g stroke="url(#pmGold)" fill="none" strokeLinecap="round">
        <path d="M 12 24 L 12 10" strokeWidth="2.4" />
        <path
          d="M 12 10.5 C 19 9, 22 12, 22 15.5 C 22 19, 19 21, 12 20"
          strokeWidth="2.4"
        />
        <path
          d="M 12 19 C 15.5 18.5, 17.5 20, 17.5 22.5"
          strokeWidth="1.5"
          opacity="0.85"
        />
      </g>

      {/* spark accent */}
      <path
        d="M 26 7 L 27 9.5 L 29.5 10.5 L 27 11.5 L 26 14 L 25 11.5 L 22.5 10.5 L 25 9.5 Z"
        fill="#F5D78E"
      />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reveal = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(12px)",
    transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    if (!email.trim()) {
      setError("Enter your email.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }
    setLoading(true);
    try {
      const loggedInUser = await login(email.trim(), password, rememberMe);
      if (loggedInUser?.mfaRequired && loggedInUser?.mfaToken) {
        navigate("/mfa-verify", {
          replace: true,
          state: { mfaToken: loggedInUser.mfaToken, email: loggedInUser.email },
        });
        return;
      }
      setSuccess(true);
      await new Promise((res) => setTimeout(res, 650));
      const role = loggedInUser?.role?.toUpperCase();
      navigate(role === "ADMIN" ? "/admin" : "/developer", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      const status = err.response?.status;
      const message = err.response?.data?.message;
      if (status === 401) setError("That email or password isn't right.");
      else if (status === 403) setError("You're not authorized to log in.");
      else if (status === 404)
        setError("Login API was not found. Check the backend.");
      else if (err.code === "ERR_NETWORK")
        setError(
          "Can't reach the backend. Make sure Spring Boot is running on port 8080.",
        );
      else if (message) setError(message);
      else setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#FCFBF9",
      borderRadius: 1.5,
      fontFamily: UI_FONT,
      fontSize: "0.95rem",
      transition: "box-shadow 0.2s ease, border-color 0.2s ease",
      "& fieldset": { borderColor: HAIRLINE },
      "&:hover fieldset": { borderColor: "rgba(24,26,46,0.22)" },
      "&.Mui-focused fieldset": {
        borderColor: GOLD,
        borderWidth: 1,
        boxShadow: "0 0 0 3px " + GOLD_SOFT,
      },
      "& .MuiInputBase-input": {
        py: 1.75,
        minHeight: 52,
        boxSizing: "border-box",
      },
    },
    "& .MuiInputLabel-root": {
      color: TEXT_MUTED,
      fontFamily: UI_FONT,
      fontSize: "0.9rem",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: SLATE },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        backgroundColor: PAPER,
        fontFamily: UI_FONT,
      }}
    >
      <style>{KEYFRAMES}</style>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Inter:wght@400;500;600&display=swap');
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus {
            -webkit-text-fill-color: ${TEXT_INK};
            -webkit-box-shadow: 0 0 0 1000px #FCFBF9 inset;
            transition: background-color 9999s ease-in-out 0s;
            caret-color: ${TEXT_INK};
          }
        `}
      </style>

      {/* NIGHT PANEL */}
      <Box
        sx={{
          position: "relative",
          width: { xs: "100%", md: "42%" },
          minHeight: { xs: 300, sm: 340, md: "100vh" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          px: { xs: 4, sm: 6, md: 7 },
          py: { xs: 4, sm: 5, md: 7 },
          overflow: "hidden",
        }}
      >
        <NightScene />
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: 1.3,
            ...reveal(0),
          }}
        >
          <PlanoraMark />
          <Typography
            sx={{
              fontFamily: DISPLAY_FONT,
              fontWeight: 500,
              fontSize: "1.35rem",
              color: PAPER,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
            }}
          >
            Planora
          </Typography>
        </Box>
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            ...reveal(0.12),
            pb: { xs: 0, md: 4 },
          }}
        >
          <Typography
            sx={{
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              fontSize: { xs: "1.35rem", sm: "1.6rem", md: "2rem" },
              lineHeight: 1.3,
              color: PAPER,
              maxWidth: 340,
              letterSpacing: "-0.01em",
            }}
          >
            Plan today.{" "}
            <Box component="span" sx={{ fontStyle: "italic", color: GOLD }}>
              Rise tomorrow.
            </Box>
          </Typography>
          <Divider
            sx={{
              my: { xs: 1.5, md: 2.5 },
              width: 48,
              borderColor: "rgba(200,161,90,0.5)",
            }}
          />
          <Typography
            sx={{
              fontSize: "0.85rem",
              lineHeight: 1.7,
              color: "rgba(247,246,242,0.55)",
              maxWidth: 300,
              display: { xs: "none", sm: "block" },
            }}
          >
            Every milestone, priority, and deadline — laid out where you can see
            the whole horizon.
          </Typography>
        </Box>
      </Box>

      {/* FORM PANEL */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "center",
          px: { xs: 2.5, sm: 6 },
          py: { xs: 4, sm: 6, md: 4 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400, mx: "auto" }}>
          {/* elevated card */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            key={error ? `form-${error}` : "form"}
            sx={{
              backgroundColor: CARD,
              border: `1px solid ${HAIRLINE}`,
              borderRadius: { xs: 2.5, sm: 3 },
              px: { xs: 2.5, sm: 5 },
              py: { xs: 3.5, sm: 5 },
              boxShadow:
                "0 1px 2px rgba(16,18,35,0.04), 0 12px 40px rgba(16,18,35,0.07)",
              animation: error ? "shake 0.45s ease" : "none",
              ...(error ? {} : reveal(0.1)),
            }}
          >
            <Typography
              sx={{
                fontFamily: DISPLAY_FONT,
                fontWeight: 500,
                fontSize: { xs: "1.7rem", sm: "1.95rem" },
                color: TEXT_INK,
                letterSpacing: "-0.01em",
              }}
            >
              Welcome back
            </Typography>
            <Typography
              sx={{ mt: 0.75, color: TEXT_MUTED, fontSize: "0.92rem" }}
            >
              Sign in to continue to your workspace.
            </Typography>

            {error && (
              <Alert
                severity="error"
                onClose={() => setError("")}
                sx={{
                  mt: 3,
                  borderRadius: 1.5,
                  fontFamily: UI_FONT,
                  fontSize: "0.88rem",
                  backgroundColor: "rgba(196,89,63,0.07)",
                  color: "#8C3A26",
                  border: "1px solid rgba(196,89,63,0.22)",
                  boxShadow: "none",
                  "& .MuiAlert-icon": { color: "#C4593F" },
                }}
              >
                {error}
              </Alert>
            )}

            <Stack spacing={2.5} sx={{ mt: 3.5 }}>
              <TextField
                variant="outlined"
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                autoFocus
                autoComplete="email"
                placeholder="you@company.com"
                sx={fieldSx}
              />
              <TextField
                variant="outlined"
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                autoComplete="current-password"
                placeholder="Enter your password"
                sx={fieldSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        size="small"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        onClick={() => setShowPassword((p) => !p)}
                        sx={{ color: TEXT_MUTED }}
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  rowGap: 0.5,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        color: "rgba(24,26,46,0.28)",
                        "&.Mui-checked": { color: GOLD },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: "0.85rem", color: TEXT_MUTED }}>
                      Remember me
                    </Typography>
                  }
                />
                <Link
                  to="/forgot-password"
                  style={{
                    color: SLATE,
                    textDecoration: "none",
                    fontWeight: 500,
                    fontSize: "0.85rem",
                    borderBottom: `1px solid rgba(28,31,51,0.25)`,
                    paddingBottom: 1,
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                disabled={loading || success}
                sx={{
                  height: 48,
                  borderRadius: 1.5,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  textTransform: "none",
                  letterSpacing: "0.01em",
                  fontFamily: UI_FONT,
                  backgroundColor: INK,
                  color: PAPER,
                  boxShadow: "none",
                  mt: 0.5,
                  transition:
                    "background-color 0.2s ease, transform 0.15s ease",
                  "&:hover": {
                    backgroundColor: SLATE,
                    boxShadow: "none",
                    transform: "translateY(-1px)",
                  },
                  "&:active": { transform: "translateY(0)" },
                  "&.Mui-disabled": {
                    backgroundColor: success
                      ? "#2E7D5B"
                      : "rgba(16,18,35,0.35)",
                    color: PAPER,
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ color: PAPER }} />
                ) : success ? (
                  <CheckCircleIcon
                    sx={{
                      fontSize: 22,
                      animation: "popIn 0.4s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  />
                ) : (
                  "Sign in"
                )}
              </Button>
            </Stack>
          </Box>

          {/* secondary card */}
          {/* <Box
            sx={{
              mt: 2.5,
              textAlign: "center",
              backgroundColor: CARD,
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 2.5,
              py: 2,
              fontSize: "0.86rem",
              color: TEXT_MUTED,
              boxShadow: "0 1px 2px rgba(16,18,35,0.03)",
              ...reveal(0.3),
            }}
          >
            New here?{" "}
            <Link
              to="/register"
              style={{
                color: SLATE,
                fontWeight: 600,
                textDecoration: "none",
                borderBottom: `1px solid rgba(28,31,51,0.3)`,
                paddingBottom: 1,
              }}
            >
              Create an account
            </Link>
          </Box> */}

          <Typography
            sx={{
              mt: 3,
              textAlign: "center",
              fontSize: "0.75rem",
              color: "rgba(113,114,127,0.7)",
              ...reveal(0.4),
            }}
          >
            Protected by enterprise-grade security.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
