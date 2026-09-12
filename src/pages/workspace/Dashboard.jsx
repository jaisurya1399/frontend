import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { getDeveloperDashboard } from "../../api/dashboardApi";
import {
  BORDER,
  PRIMARY,
  PRIMARY_SUBTLE,
  RADIUS,
  TEXT_FAINT,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "../../theme/colors";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState({
    myProjects: 0,
    myTasks: 0,
    pendingTasks: 0,
    hoursThisWeek: 0,
    recentActivity: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // LOAD DASHBOARD
  // ============================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDeveloperDashboard();

      setDashboard({
        myProjects: data?.myProjects ?? 0,
        myTasks: data?.myTasks ?? 0,
        pendingTasks: data?.pendingTasks ?? 0,
        hoursThisWeek: data?.hoursThisWeek ?? 0,
        recentActivity: Array.isArray(data?.recentActivity)
          ? data.recentActivity
          : [],
      });
    } catch (err) {
      console.error("DEVELOPER DASHBOARD API ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ============================================================
  // STATS
  // ============================================================

  const stats = [
    {
      title: "My Projects",
      value: dashboard.myProjects,
      icon: <FolderOutlinedIcon />,
    },
    {
      title: "My Tasks",
      value: dashboard.myTasks,
      icon: <AssignmentOutlinedIcon />,
    },
    {
      title: "Pending Tasks",
      value: dashboard.pendingTasks,
      icon: <AssignmentOutlinedIcon />,
    },
    {
      title: "Hours This Week",
      value: `${dashboard.hoursThisWeek}h`,
      icon: <AccessTimeOutlinedIcon />,
    },
  ];

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <Box sx={{ p: 3 }}>
      {/* ======================================================
          HEADER
      ====================================================== */}

      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: 28,
            fontWeight: 800,
            color: TEXT_PRIMARY,
          }}
        >
          Dashboard
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            color: TEXT_SECONDARY,
            fontSize: 14,
          }}
        >
          Welcome back! Here's an overview of your work.
        </Typography>
      </Box>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: `${RADIUS.card}px`,
          }}
        >
          {error}
        </Alert>
      )}

      {/* ======================================================
          STAT CARDS
      ====================================================== */}

      <Grid container spacing={2.5}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.title}>
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${BORDER}`,
                borderRadius: `${RADIUS.card}px`,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: TEXT_SECONDARY,
                        mb: 1,
                      }}
                    >
                      {stat.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 28,
                        fontWeight: 800,
                        color: TEXT_PRIMARY,
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: PRIMARY_SUBTLE,
                      color: PRIMARY,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ======================================================
          RECENT ACTIVITY
      ====================================================== */}

      <Card
        elevation={0}
        sx={{
          mt: 3,
          border: `1px solid ${BORDER}`,
          borderRadius: `${RADIUS.card}px`,
        }}
      >
        <CardContent>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              mb: 2,
            }}
          >
            Recent Activity
          </Typography>

          {dashboard.recentActivity.length === 0 ? (
            <Typography
              sx={{
                color: TEXT_SECONDARY,
                fontSize: 14,
              }}
            >
              No recent activity found.
            </Typography>
          ) : (
            <Box>
              {dashboard.recentActivity.map((activity) => (
                <Paper
                  key={activity.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    border: `1px solid ${BORDER}`,
                    borderRadius: `${RADIUS.card}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: TEXT_PRIMARY,
                      }}
                    >
                      {activity.ticketName || "Ticket"}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: 13,
                        color: TEXT_SECONDARY,
                      }}
                    >
                      {activity.oldStatus || "-"}
                      {" → "}
                      {activity.newStatus || "-"}
                    </Typography>

                    {activity.createdAt && (
                      <Typography
                        sx={{
                          mt: 0.5,
                          fontSize: 12,
                          color: TEXT_FAINT,
                        }}
                      >
                        {new Date(activity.createdAt).toLocaleString()}
                      </Typography>
                    )}
                  </Box>

                  <ArrowForwardIcon
                    sx={{
                      color: TEXT_FAINT,
                      flexShrink: 0,
                    }}
                  />
                </Paper>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
