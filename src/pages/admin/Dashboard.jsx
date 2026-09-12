import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPermissions } from "../../api/permissionApi";
import { getActiveProjects, getProjects } from "../../api/projectApi";
import { getRoles } from "../../api/roleApi";
import { getActiveTickets, getTickets } from "../../api/ticketApi";
import { getUsers } from "../../api/userApi";

function Metric({ title, value, icon, tone = "primary", hint, path }) {
  const navigate = useNavigate();
  const tones = {
    primary: ["#EFF6FF", "#1D4ED8"],
    success: ["#F0FDF4", "#15803D"],
    warning: ["#FFFBEB", "#B45309"],
    danger: ["#FEF2F2", "#B91C1C"],
    neutral: ["#F8FAFC", "#475569"],
  };
  const [bg, fg] = tones[tone] || tones.primary;
  return (
    <Card
      className="pm-hover-lift"
      onClick={() => path && navigate(path)}
      sx={{ height: "100%", cursor: path ? "pointer" : "default" }}
    >
      <CardContent sx={{ p: { xs: 2, md: 2.25 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {title}
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                fontSize: 30,
                lineHeight: 1.15,
                fontWeight: 800,
                letterSpacing: "-.03em",
              }}
            >
              {value}
            </Typography>
            {hint && (
              <Typography variant="caption" color="text.secondary">
                {hint}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 42,
              height: 42,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: 2,
              bgcolor: bg,
              color: fg,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function Panel({ title, subtitle, action, children, sx }) {
  return (
    <Card sx={{ height: "100%", ...sx }}>
      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
          }}
        >
          {
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.35 }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          }
          {action}
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [data, setData] = useState({
    users: 0,
    projects: 0,
    activeProjects: 0,
    tickets: 0,
    activeTickets: 0,
    roles: 0,
    permissions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const [
          users,
          projects,
          activeProjects,
          tickets,
          activeTickets,
          roles,
          permissions,
        ] = await Promise.all([
          getUsers(),
          getProjects(),
          getActiveProjects(),
          getTickets(),
          getActiveTickets(),
          getRoles(),
          getPermissions(),
        ]);
        setData({
          users: users.length,
          projects: projects.length,
          activeProjects: activeProjects.length,
          tickets: tickets.length,
          activeTickets: activeTickets.length,
          roles: roles.length,
          permissions: permissions.length,
        });
      } catch (err) {
        setError(
          err.response?.status === 403
            ? "You do not have permission to view the admin dashboard."
            : "Unable to load dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 17) {
      return "Good afternoon";
    }

    return "Good evening";
  };

  const activeRate = useMemo(
    () =>
      data.tickets ? Math.round((data.activeTickets / data.tickets) * 100) : 0,
    [data],
  );
  const projectRate = useMemo(
    () =>
      data.projects
        ? Math.round((data.activeProjects / data.projects) * 100)
        : 0,
    [data],
  );
  if (loading)
    return (
      <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <CircularProgress size={28} />
      </Box>
    );
  return (
    <Box className="app-page pm-fade-up">
      <Box
        className="page-header"
        sx={{ alignItems: { xs: "stretch", sm: "center" } }}
      >
        <Box>
          <Typography variant="overline" color="primary">
            Admin overview
          </Typography>

          <Typography variant="h1">{getGreeting()} 👋</Typography>

          <Typography className="page-subtitle">
            A decision-first view of projects, tickets and platform activity.
          </Typography>
        </Box>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ flexShrink: 0 }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/projects")}
          >
            View projects
          </Button>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => navigate("/admin/projects")}
          >
            Create project
          </Button>
        </Stack>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2.5 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={2} className="pm-stagger" mb={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Metric
            title="Active projects"
            value={data.activeProjects}
            hint={`${projectRate}% of all projects`}
            icon={<FolderRoundedIcon />}
            path="/admin/projects"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Metric
            title="Open tickets"
            value={data.activeTickets}
            hint={`${activeRate}% of all tickets`}
            icon={<ConfirmationNumberRoundedIcon />}
            tone="primary"
            path="/admin/tickets"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Metric
            title="People"
            value={data.users}
            hint="Registered users"
            icon={<PeopleRoundedIcon />}
            tone="success"
            path="/admin/users"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Metric
            title="Roles & permissions"
            value={`${data.roles} / ${data.permissions}`}
            hint="Governance coverage"
            icon={<ShieldRoundedIcon />}
            tone="neutral"
            path="/admin/roles"
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 0.25 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Panel
            title="Platform health"
            subtitle="Current workload mix and operational capacity"
          >
            <Stack spacing={2.25}>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.75,
                  }}
                >
                  <Typography variant="body2" fontWeight={650}>
                    Projects active
                  </Typography>
                  <Typography variant="body2" fontWeight={750}>
                    {projectRate}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={projectRate}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "#E2E8F0",
                    "& .MuiLinearProgress-bar": { borderRadius: 4 },
                  }}
                />
              </Box>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.75,
                  }}
                >
                  <Typography variant="body2" fontWeight={650}>
                    Tickets currently active
                  </Typography>
                  <Typography variant="body2" fontWeight={750}>
                    {activeRate}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={activeRate}
                  sx={{ height: 8, borderRadius: 4, bgcolor: "#E2E8F0" }}
                />
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 1.5,
                }}
              >
                <Box sx={{ p: 1.5, bgcolor: "#F8FAFC", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    All projects
                  </Typography>
                  <Typography variant="h6" fontWeight={800}>
                    {data.projects}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: "#F8FAFC", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    All tickets
                  </Typography>
                  <Typography variant="h6" fontWeight={800}>
                    {data.tickets}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: "#F8FAFC", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Active tickets
                  </Typography>
                  <Typography variant="h6" fontWeight={800}>
                    {data.activeTickets}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Panel>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Panel title="Needs attention" subtitle="Recommended next actions">
            <Stack spacing={1}>
              <Button
                fullWidth
                onClick={() => navigate("/admin/tickets")}
                sx={{
                  justifyContent: "flex-start",
                  p: 1.5,
                  bgcolor: "#FEF2F2",
                  color: "#991B1B",
                  "&:hover": { bgcolor: "#FEE2E2" },
                }}
                startIcon={<WarningAmberRoundedIcon />}
                endIcon={<ArrowForwardRoundedIcon />}
              >
                <Box sx={{ flex: 1, textAlign: "left" }}>
                  <Typography fontWeight={750}>Review open tickets</Typography>
                  <Typography variant="caption">
                    {data.activeTickets} active items need triage
                  </Typography>
                </Box>
              </Button>
              <Button
                fullWidth
                onClick={() => navigate("/admin/projects")}
                sx={{
                  justifyContent: "flex-start",
                  p: 1.5,
                  bgcolor: "#EFF6FF",
                  color: "#1D4ED8",
                  "&:hover": { bgcolor: "#DBEAFE" },
                }}
                startIcon={<FolderRoundedIcon />}
                endIcon={<ArrowForwardRoundedIcon />}
              >
                <Box sx={{ flex: 1, textAlign: "left" }}>
                  <Typography fontWeight={750}>
                    Review active projects
                  </Typography>
                  <Typography variant="caption">
                    {data.activeProjects} projects are currently active
                  </Typography>
                </Box>
              </Button>
              <Button
                fullWidth
                onClick={() => navigate("/admin/member-availability")}
                sx={{
                  justifyContent: "flex-start",
                  p: 1.5,
                  bgcolor: "#F0FDF4",
                  color: "#166534",
                  "&:hover": { bgcolor: "#DCFCE7" },
                }}
                startIcon={<AccessTimeRoundedIcon />}
                endIcon={<ArrowForwardRoundedIcon />}
              >
                <Box sx={{ flex: 1, textAlign: "left" }}>
                  <Typography fontWeight={750}>
                    Check team availability
                  </Typography>
                  <Typography variant="caption">
                    Review capacity before assigning new work
                  </Typography>
                </Box>
              </Button>
            </Stack>
          </Panel>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Panel
            title="Admin shortcuts"
            subtitle="High-frequency configuration and governance tasks"
          >
            <Grid container spacing={1.5}>
              {[
                ["Users", "/admin/users", PeopleRoundedIcon],
                ["Roles", "/admin/roles", ShieldRoundedIcon],
                [
                  "Notifications",
                  "/admin/notifications",
                  CheckCircleRoundedIcon,
                ],
                ["Timesheet", "/admin/timesheet", AccessTimeRoundedIcon],
              ].map(([label, path, Icon]) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={path}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate(path)}
                    sx={{
                      minHeight: 52,
                      justifyContent: "flex-start",
                      gap: 1.25,
                    }}
                  >
                    <Icon fontSize="small" />
                    <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
                    <ArrowForwardRoundedIcon fontSize="small" />
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Panel>
        </Grid>
      </Grid>
    </Box>
  );
}
