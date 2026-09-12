import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDeveloperDashboard } from "../../api/dashboardApi";
import { getSprintsByProject } from "../../api/sprintApi";
import { getProjectBoard, transitionTicket } from "../../api/ticketApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  BORDER,
  ELEVATION_SHADOW,
  RADIUS,
  TEXT_FAINT,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "../../theme/colors";

function TicketCard({ ticket, onClick, onDragStart, canMove }) {
  const initials = (ticket.responsibleName || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <Card
      draggable={canMove}
      onDragStart={canMove ? (event) => onDragStart(event, ticket) : undefined}
      onClick={() => onClick(ticket.id)}
      elevation={0}
      sx={{
        cursor: canMove ? "grab" : "pointer",
        border: `1px solid ${BORDER}`,
        borderRadius: `${RADIUS.card}px`,
        transition: "all .18s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: ELEVATION_SHADOW,
          borderColor: "primary.main",
        },
        "&:active": { cursor: canMove ? "grabbing" : "pointer" },
      }}
    >
      <CardContent sx={{ p: 1.75, "&:last-child": { pb: 1.75 } }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          sx={{ mb: 1 }}
        >
          <Typography variant="caption" fontWeight={800} color="primary.main">
            {ticket.code || `#${ticket.id}`}
          </Typography>
          {ticket.priorityName && (
            <Chip
              size="small"
              label={ticket.priorityName}
              variant="outlined"
              sx={{
                height: 22,
                fontSize: ".68rem",
                color: ticket.priorityColor || undefined,
                borderColor: ticket.priorityColor || undefined,
              }}
            />
          )}
        </Stack>

        <Typography
          variant="body2"
          fontWeight={650}
          sx={{
            lineHeight: 1.4,
            mb: 1.25,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {ticket.name || "Untitled ticket"}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={0.75} alignItems="center">
            {ticket.typeName && (
              <Tooltip title={ticket.typeName}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#fff",
                    backgroundColor: ticket.typeColor || TEXT_FAINT,
                  }}
                >
                  {ticket.typeIcon
                    ? String(ticket.typeIcon).slice(0, 1).toUpperCase()
                    : ticket.typeName.slice(0, 1).toUpperCase()}
                </Box>
              </Tooltip>
            )}
            {Number(ticket.estimation || 0) > 0 && (
              <Chip
                size="small"
                variant="outlined"
                label={`${ticket.estimation} SP`}
                sx={{ height: 21, fontSize: ".65rem" }}
              />
            )}
          </Stack>

          <Tooltip title={ticket.responsibleName || "Unassigned"}>
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 800,
                color: "#fff",
                bgcolor: ticket.responsibleName ? "primary.main" : TEXT_FAINT,
              }}
            >
              {ticket.responsibleName ? initials : "?"}
            </Box>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
}

function BoardColumn({
  column,
  onTicketClick,
  onDragStart,
  onDrop,
  canBoardMove,
  canMoveTicket,
}) {
  const [dragOver, setDragOver] = useState(false);
  const tickets = column.tickets || [];

  return (
    <Paper
      elevation={0}
      onDragOver={
        canBoardMove
          ? (event) => {
              event.preventDefault();
              setDragOver(true);
            }
          : undefined
      }
      onDragLeave={canBoardMove ? () => setDragOver(false) : undefined}
      onDrop={
        canBoardMove
          ? (event) => {
              setDragOver(false);
              onDrop(event, column);
            }
          : undefined
      }
      sx={{
        minWidth: { xs: 290, md: 310 },
        width: { xs: 290, md: 310 },
        minHeight: 500,
        border: "1px solid",
        borderColor: dragOver ? "primary.main" : "divider",
        borderRadius: `${RADIUS.card}px`,
        bgcolor: dragOver ? "action.hover" : "background.default",
        overflow: "hidden",
        transition: "border-color .15s ease, background-color .15s ease",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.6,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                bgcolor: column.statusColor || "text.secondary",
              }}
            />
            <Typography variant="subtitle1" fontWeight={750}>
              {column.displayName || column.statusName || "Status"}
            </Typography>
          </Stack>
          <Chip
            label={tickets.length}
            size="small"
            sx={{ fontWeight: 750, minWidth: 36 }}
          />
        </Stack>
      </Box>

      <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1.25 }}>
        {tickets.length === 0 ? (
          <Box
            sx={{
              minHeight: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              px: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No tickets in this status.
            </Typography>
          </Box>
        ) : (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={onTicketClick}
              onDragStart={onDragStart}
              canMove={canMoveTicket(ticket)}
            />
          ))
        )}
      </Box>
    </Paper>
  );
}

export default function DeveloperBoard() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isSystemAdmin, getProjectMembership } = useAuth();

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [columns, setColumns] = useState([]);
  const [activeSprint, setActiveSprint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const membership = useMemo(
    () => (selectedProjectId ? getProjectMembership(selectedProjectId) : null),
    [selectedProjectId, getProjectMembership],
  );

  // Visibility is project-wide for Developers. Editing/moving is assignment-based:
  // Developers may modify only tickets assigned to themselves. Project Admins
  // retain full board editing; backend authorization remains the final authority.
  const canBoardEdit =
    isSystemAdmin() ||
    membership?.role === "PROJECT_ADMIN" ||
    membership?.role === "MEMBER";

  const isDeveloper =
    !isSystemAdmin() &&
    membership?.role === "MEMBER" &&
    String(membership?.responsibilityRole || "").toUpperCase() === "DEVELOPER";

  const canMoveTicket = useCallback(
    (ticket) => {
      if (!canBoardEdit) return false;
      if (!isDeveloper) return true;
      return Number(ticket?.responsibleId) === Number(user?.id);
    },
    [canBoardEdit, isDeveloper, user?.id],
  );

  const loadProjects = useCallback(async () => {
    try {
      const dashboard = await getDeveloperDashboard();
      const list = Array.isArray(dashboard?.projects) ? dashboard.projects : [];
      setProjects(list);

      if (!selectedProjectId && list.length) {
        setSelectedProjectId(String(list[0].id));
      }
      if (!list.length) setLoading(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load your projects.");
      setLoading(false);
    }
  }, [selectedProjectId]);

  const loadBoard = useCallback(async (projectId, refresh = false) => {
    if (!projectId) return;

    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);
      setError("");

      const [boardData, sprintData] = await Promise.all([
        getProjectBoard(Number(projectId)),
        getSprintsByProject(Number(projectId)),
      ]);

      const sprintList = Array.isArray(sprintData) ? sprintData : [];
      const active = sprintList.find(
        (sprint) => String(sprint.status).toUpperCase() === "ACTIVE",
      );
      setActiveSprint(active || null);
      setColumns(Array.isArray(boardData) ? boardData : []);
    } catch (err) {
      console.error("Developer board load error:", err);
      setColumns([]);
      setError(
        err?.response?.data?.message || "Unable to load the project board.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (selectedProjectId) loadBoard(selectedProjectId);
  }, [selectedProjectId, loadBoard]);

  const visibleColumns = useMemo(() => {
    if (!activeSprint) return columns;

    return columns.map((column) => ({
      ...column,
      tickets: (column.tickets || []).filter(
        (ticket) => Number(ticket.sprintId) === Number(activeSprint.id),
      ),
    }));
  }, [columns, activeSprint]);

  const totalTickets = useMemo(
    () =>
      visibleColumns.reduce(
        (sum, column) => sum + (column.tickets?.length || 0),
        0,
      ),
    [visibleColumns],
  );

  const handleDragStart = (event, ticket) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ ticketId: ticket.id, fromStatusId: ticket.statusId }),
    );
  };

  const handleDrop = async (event, targetColumn) => {
    event.preventDefault();
    if (!canBoardEdit) return;

    let payload;
    try {
      payload = JSON.parse(event.dataTransfer.getData("text/plain") || "{}");
    } catch {
      return;
    }

    const { ticketId, fromStatusId } = payload;
    if (!ticketId || Number(fromStatusId) === Number(targetColumn.statusId))
      return;

    const previous = columns;
    const moved = previous
      .flatMap((column) => column.tickets || [])
      .find((ticket) => Number(ticket.id) === Number(ticketId));

    if (!moved) return;

    if (!canMoveTicket(moved)) {
      toast.error("You can move only tickets assigned to you.");
      return;
    }

    setColumns((current) =>
      current.map((column) => {
        if (Number(column.statusId) === Number(fromStatusId)) {
          return {
            ...column,
            tickets: (column.tickets || []).filter(
              (ticket) => Number(ticket.id) !== Number(ticketId),
            ),
          };
        }

        if (Number(column.statusId) === Number(targetColumn.statusId)) {
          return {
            ...column,
            tickets: [
              ...(column.tickets || []),
              {
                ...moved,
                statusId: targetColumn.statusId,
                statusName: targetColumn.statusName,
                statusColor: targetColumn.statusColor,
              },
            ],
          };
        }

        return column;
      }),
    );

    try {
      await transitionTicket(ticketId, targetColumn.statusId);
      toast.success("Ticket status updated.");
    } catch (err) {
      setColumns(previous);
      toast.error(
        err?.response?.data?.message ||
          "Unable to move the ticket. Changes were reverted.",
      );
    }
  };

  const selectedProject = projects.find(
    (project) => Number(project.id) === Number(selectedProjectId),
  );

  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack
        direction={{ xs: "column", lg: "row" }}
        alignItems={{ xs: "stretch", lg: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
            sx={{ mb: 0.5 }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                bgcolor: "primary.50",
                color: "primary.main",
              }}
            >
              <ViewKanbanOutlinedIcon fontSize="small" />
            </Box>
            <Typography variant="h5" fontWeight={800} color={TEXT_PRIMARY}>
              Board
            </Typography>
          </Stack>
          <Typography variant="body2" color={TEXT_SECONDARY}>
            Work with your project tickets across the workflow.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {membership?.role && (
            <Chip
              size="small"
              label={
                membership.role === "MEMBER"
                  ? `Member${membership.responsibilityRole ? ` • ${membership.responsibilityRole}` : ""}`
                  : membership.role.replaceAll("_", " ")
              }
              variant="outlined"
            />
          )}
          {!canBoardEdit && (
            <Chip size="small" label="Read only" color="default" />
          )}
          {isDeveloper && (
            <Chip
              size="small"
              label="Edit: assigned tasks only"
              color="primary"
              variant="outlined"
            />
          )}
          <Tooltip title="Refresh board">
            <span>
              <Button
                variant="outlined"
                startIcon={
                  refreshing ? <CircularProgress size={17} /> : <RefreshIcon />
                }
                onClick={() => loadBoard(selectedProjectId, true)}
                disabled={!selectedProjectId || refreshing}
                sx={{ textTransform: "none" }}
              >
                Refresh
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          border: `1px solid ${BORDER}`,
          borderRadius: `${RADIUS.card}px`,
        }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <FormControl fullWidth sx={{ maxWidth: { md: 420 } }}>
              <InputLabel>Project</InputLabel>
              <Select
                value={selectedProjectId}
                label="Project"
                onChange={(event) => setSelectedProjectId(event.target.value)}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={String(project.id)}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={`${totalTickets} tickets`} variant="outlined" />
              {activeSprint && (
                <Chip
                  label={`Sprint: ${activeSprint.name}`}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2.5 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => loadBoard(selectedProjectId)}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {!selectedProjectId && !loading ? (
        <Card elevation={0} sx={{ border: `1px solid ${BORDER}` }}>
          <CardContent sx={{ py: 8, textAlign: "center" }}>
            <Typography variant="h6" fontWeight={700}>
              No projects available
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              You need project access before you can use a board.
            </Typography>
          </CardContent>
        </Card>
      ) : loading ? (
        <Box sx={{ minHeight: 420, display: "grid", placeItems: "center" }}>
          <Stack spacing={1.5} alignItems="center">
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Loading {selectedProject?.name || "project"} board...
            </Typography>
          </Stack>
        </Box>
      ) : (
        <Box>
          {activeSprint && (
            <Alert
              severity="info"
              icon={<ViewKanbanOutlinedIcon fontSize="inherit" />}
              sx={{ mb: 2 }}
              action={
                <Button
                  size="small"
                  color="inherit"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/developer/tasks")}
                >
                  My Tasks
                </Button>
              }
            >
              Showing tickets from the active sprint:{" "}
              <strong>{activeSprint.name}</strong>
            </Alert>
          )}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              overflowX: "auto",
              pb: 2,
              alignItems: "flex-start",
              "&::-webkit-scrollbar": { height: 8 },
            }}
          >
            {visibleColumns.length ? (
              visibleColumns.map((column) => (
                <BoardColumn
                  key={column.statusId || column.id || column.statusName}
                  column={column}
                  onTicketClick={(ticketId) =>
                    navigate(`/developer/tickets/${ticketId}`)
                  }
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                  canBoardMove={canBoardEdit}
                  canMoveTicket={canMoveTicket}
                />
              ))
            ) : (
              <Card
                elevation={0}
                sx={{ width: "100%", border: `1px solid ${BORDER}` }}
              >
                <CardContent sx={{ py: 8, textAlign: "center" }}>
                  <Typography variant="h6" fontWeight={700}>
                    No board columns available
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    This project does not have an active board configuration
                    yet.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
