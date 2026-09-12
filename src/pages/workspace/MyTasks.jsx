import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RefreshIcon from "@mui/icons-material/Refresh";

import { getMyTasks } from "../../api/ticketApi";

export default function MyTasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // LOAD MY TASKS
  // ============================================================

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyTasks();

      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("MY TASKS API ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load assigned tasks.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadTasks();
  }, []);

  // ============================================================
  // OPEN TICKET DETAILS
  // ============================================================

  const handleTaskClick = (taskId) => {
    if (!taskId) {
      console.error("Ticket ID is missing.");
      return;
    }

    navigate(`/developer/tickets/${taskId}`);
  };

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
  // PAGE
  // ============================================================

  return (
    <Box sx={{ p: 3 }}>
      {/* ======================================================
          HEADER
      ====================================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <AssignmentIcon />
            My Tasks
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Tickets assigned to you
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadTasks}
        >
          Refresh
        </Button>
      </Box>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* ======================================================
          NO TASKS
      ====================================================== */}

      {!error && tasks.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <AssignmentIcon
            sx={{
              fontSize: 55,
              color: "text.secondary",
              mb: 1,
            }}
          />

          <Typography variant="h6" fontWeight={600}>
            No tasks assigned
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            You currently don't have any tickets assigned to you.
          </Typography>
        </Paper>
      )}

      {/* ======================================================
          TASK LIST
      ====================================================== */}

      {!error &&
        tasks.map((task) => (
          <Paper
            key={task.id}
            onClick={() => handleTaskClick(task.id)}
            elevation={0}
            sx={{
              p: 2.5,
              mb: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              cursor: "pointer",
              transition: "all 0.2s ease",

              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-2px)",
                borderColor: "primary.main",
              },
            }}
          >
            {/* =================================================
                TOP
            ================================================= */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 2,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={600}
                >
                  {task.code || `TICKET-${task.id}`}
                </Typography>

                <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
                  {task.name || "Untitled Ticket"}
                </Typography>
              </Box>

              <ArrowForwardIcon color="action" sx={{ flexShrink: 0 }} />
            </Box>

            {/* =================================================
                PROJECT
            ================================================= */}

            <Typography variant="body2" sx={{ mt: 2 }}>
              <strong>Project:</strong> {task.projectName || "-"}
            </Typography>

            {task.dueDate && (
              <Chip
                size="small"
                sx={{ mt: 1.5 }}
                color={
                  new Date(task.dueDate).getTime() < Date.now() &&
                  task.statusCategory !== "DONE" &&
                  task.statusCategory !== "CANCELLED"
                    ? "error"
                    : "default"
                }
                label={`Due: ${new Date(task.dueDate).toLocaleString()}`}
              />
            )}

            {/* =================================================
                STATUS
            ================================================= */}

            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <strong>Status:</strong> {task.statusName || "-"}
            </Typography>

            {/* =================================================
                PRIORITY
            ================================================= */}

            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <strong>Priority:</strong> {task.priorityName || "-"}
            </Typography>
          </Paper>
        ))}
    </Box>
  );
}
