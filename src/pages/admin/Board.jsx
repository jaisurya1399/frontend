import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import SettingsIcon from "@mui/icons-material/Settings";
import TimelineIcon from "@mui/icons-material/Timeline";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
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
import BoardHistoryDialog from "./BoardHistoryDialog";
import KanbanBoardConfigDialog from "./KanbanBoardConfigDialog";
import KanbanCumulativeFlowDialog from "./KanbanCumulativeFlowDialog";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getBoardColumns,
  getBoardConfig,
  updateBoardColumns,
  updateBoardConfig,
} from "../../api/boardApi";
import { getActiveProjects } from "../../api/projectApi";
import { getSprintsByProject } from "../../api/sprintApi";
import { getProjectBoard, transitionTicket } from "../../api/ticketApi";
import { useToast } from "../../context/ToastContext";
import { ELEVATION_SHADOW, RADIUS, TEXT_FAINT } from "../../theme/colors";

function TicketCard({ ticket, onClick, onDragStart, showEpic }) {
  const initials = (ticket.responsibleName || "?")
    .trim()
    .charAt(0)
    .toUpperCase();
  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, ticket)}
      onClick={() => onClick(ticket.id)}
      sx={{
        cursor: "grab",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: `${RADIUS.card}px`,
        transition: "all .2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: ELEVATION_SHADOW,
          borderColor: "primary.main",
        },
      }}
    >
      <CardContent sx={{ p: 1.75, "&:last-child": { pb: 1.75 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          sx={{ mb: 1 }}
        >
          <Typography variant="caption" fontWeight={700} color="primary.main">
            {ticket.code || `#${ticket.id}`}
          </Typography>
          {ticket.priorityName && (
            <Chip
              size="small"
              label={ticket.priorityName}
              variant="outlined"
              sx={{
                fontSize: ".68rem",
                height: 22,
                color: ticket.priorityColor || undefined,
                borderColor: ticket.priorityColor || undefined,
              }}
            />
          )}
        </Stack>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            lineHeight: 1.35,
            mb: 1.1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {ticket.name}
        </Typography>
        {showEpic && ticket.epicName && (
          <Chip
            size="small"
            label={`Epic: ${ticket.epicName}`}
            variant="outlined"
            sx={{ mb: 1, maxWidth: "100%" }}
          />
        )}
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
                    width: 18,
                    height: 18,
                    borderRadius: `${RADIUS.chip}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#fff",
                    backgroundColor: ticket.typeColor || TEXT_FAINT,
                  }}
                >
                  {ticket.typeIcon
                    ? String(ticket.typeIcon).slice(0, 1).toUpperCase()
                    : ticket.typeName.charAt(0).toUpperCase()}
                </Box>
              </Tooltip>
            )}
            {Number(ticket.estimation || 0) > 0 && (
              <Chip
                size="small"
                variant="outlined"
                label={`${ticket.estimation} sp`}
                sx={{ height: 20, fontSize: ".65rem" }}
              />
            )}
          </Stack>
          <Tooltip title={ticket.responsibleName || "Unassigned"}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
                backgroundColor: ticket.responsibleName
                  ? "primary.main"
                  : TEXT_FAINT,
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

function BoardColumn({ column, tickets, onTicketClick, onDragStart, onDrop }) {
  const [dragOver, setDragOver] = useState(false);
  const limit = Number(column.wipLimit || 0);
  const over = limit > 0 && tickets.length >= limit;
  return (
    <Paper
      elevation={0}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        setDragOver(false);
        onDrop(e, column);
      }}
      sx={{
        minHeight: 500,
        border: "1px solid",
        borderColor: dragOver ? "primary.main" : "divider",
        borderRadius: `${RADIUS.card}px`,
        backgroundColor: dragOver ? "action.hover" : "background.default",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
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
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: column.statusColor || "text.secondary",
              }}
            />
            <Typography variant="subtitle1" fontWeight={700}>
              {column.displayName || column.statusName}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Chip
              label={limit > 0 ? `${tickets.length}/${limit}` : tickets.length}
              size="small"
              color={over ? "error" : "default"}
              sx={{ fontWeight: 700, minWidth: 45 }}
            />
            {limit > 0 && (
              <Typography
                variant="caption"
                color={over ? "error" : "text.secondary"}
              >
                WIP
              </Typography>
            )}
          </Stack>
        </Stack>
        {over && (
          <Typography variant="caption" color="error">
            WIP limit reached
          </Typography>
        )}
      </Box>
      <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1.25 }}>
        {tickets.length === 0 ? (
          <Box
            sx={{
              minHeight: 160,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              px: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No tickets in this column.
            </Typography>
          </Box>
        ) : (
          tickets.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              onClick={onTicketClick}
              onDragStart={onDragStart}
              showEpic={column.showEpic}
            />
          ))
        )}
      </Box>
    </Paper>
  );
}

export default function Board() {
  const navigate = useNavigate();
  const toast = useToast();
  const [projects, setProjects] = useState([]),
    [selectedProjectId, setSelectedProjectId] = useState("");
  const [columns, setColumns] = useState([]),
    [config, setConfig] = useState(null),
    [columnConfig, setColumnConfig] = useState([]),
    [activeSprint, setActiveSprint] = useState(null);
  const [loading, setLoading] = useState(true),
    [refreshing, setRefreshing] = useState(false),
    [error, setError] = useState("");
  const [configOpen, setConfigOpen] = useState(false),
    [cfdOpen, setCfdOpen] = useState(false),
    [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getActiveProjects();
        const list = Array.isArray(data) ? data : [];
        setProjects(list);
        if (list.length) setSelectedProjectId(String(list[0].id));
        else setLoading(false);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load projects.");
        setLoading(false);
      }
    })();
  }, []);

  const loadBoard = useCallback(async (projectId, isRefresh = false) => {
    if (!projectId) return;
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError("");
      const [boardData, sprints, cfg, cols] = await Promise.all([
        getProjectBoard(projectId),
        getSprintsByProject(projectId),
        getBoardConfig(projectId),
        getBoardColumns(projectId),
      ]);
      const sprintList = Array.isArray(sprints) ? sprints : [];
      setActiveSprint(sprintList.find((s) => s.status === "ACTIVE") || null);
      setConfig(cfg);
      setColumnConfig(Array.isArray(cols) ? cols : []);
      const configMap = new Map(
        (Array.isArray(cols) ? cols : []).map((c) => [Number(c.statusId), c]),
      );
      const list = (Array.isArray(boardData) ? boardData : [])
        .map((c) => ({
          ...c,
          ...(configMap.get(Number(c.statusId)) || {}),
          showEpic: cfg?.showEpic !== false,
        }))
        .filter((c) => c.enabled !== false)
        .sort(
          (a, b) =>
            (a.displayOrder ?? a.order ?? 0) - (b.displayOrder ?? b.order ?? 0),
        );
      setColumns(list);
    } catch (e) {
      console.error(e);
      setError(
        e?.response?.data?.message || e?.message || "Failed to load board.",
      );
      setColumns([]);
      setColumnConfig([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  useEffect(() => {
    if (selectedProjectId) loadBoard(selectedProjectId);
  }, [selectedProjectId, loadBoard]);

  const displayColumns = useMemo(() => {
    if (config?.activeSprintOnly !== false && activeSprint)
      return columns.map((c) => ({
        ...c,
        tickets: (c.tickets || []).filter(
          (t) => Number(t.sprintId) === Number(activeSprint.id),
        ),
      }));
    return columns;
  }, [columns, activeSprint, config]);
  const totalTicketCount = useMemo(
    () => displayColumns.reduce((s, c) => s + (c.tickets?.length || 0), 0),
    [displayColumns],
  );
  const lanes = useMemo(() => {
    const type = config?.swimlaneType || "NONE";
    if (type === "NONE")
      return [{ key: "__all__", label: null, columns: displayColumns }];
    const groups = new Map();
    const getKey = (t) => {
      if (type === "ASSIGNEE")
        return t.responsibleId ? String(t.responsibleId) : "__unassigned__";
      if (type === "EPIC") return t.epicId ? String(t.epicId) : "__no_epic__";
      return t.priorityId ? String(t.priorityId) : "__no_priority__";
    };
    const getLabel = (t) => {
      if (type === "ASSIGNEE") return t.responsibleName || "Unassigned";
      if (type === "EPIC") return t.epicName || "No Epic";
      return t.priorityName || "No Priority";
    };
    displayColumns.forEach((col) =>
      (col.tickets || []).forEach((t) => {
        const k = getKey(t);
        if (!groups.has(k)) groups.set(k, { key: k, label: getLabel(t) });
      }),
    );
    return [...groups.values()].map((g) => ({
      ...g,
      columns: displayColumns.map((c) => ({
        ...c,
        tickets: (c.tickets || []).filter((t) => getKey(t) === g.key),
      })),
    }));
  }, [config, displayColumns]);

  const handleDragStart = (e, t) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ ticketId: t.id, fromStatusId: t.statusId }),
    );
  };
  const handleDrop = async (e, target) => {
    e.preventDefault();
    let payload = {};
    try {
      payload = JSON.parse(e.dataTransfer.getData("text/plain") || "{}");
    } catch {
      return;
    }
    const { ticketId, fromStatusId } = payload;
    if (!ticketId || Number(fromStatusId) === Number(target.statusId)) return;
    const limit = Number(target.wipLimit || 0);
    const targetCount = (
      columns.find((c) => Number(c.statusId) === Number(target.statusId))
        ?.tickets || []
    ).length;
    if (config?.enforceWip && limit > 0 && targetCount >= limit) {
      toast.error(
        `WIP limit reached for ${target.displayName || target.statusName} (${limit}).`,
      );
      return;
    }
    const previous = columns;
    setColumns((prev) =>
      prev.map((c) => {
        if (Number(c.statusId) === Number(fromStatusId))
          return {
            ...c,
            tickets: (c.tickets || []).filter(
              (t) => Number(t.id) !== Number(ticketId),
            ),
          };
        if (Number(c.statusId) === Number(target.statusId)) {
          const moved = previous
            .flatMap((x) => x.tickets || [])
            .find((t) => Number(t.id) === Number(ticketId));
          return moved
            ? {
                ...c,
                tickets: [
                  ...(c.tickets || []),
                  {
                    ...moved,
                    statusId: target.statusId,
                    statusName: target.statusName,
                    statusColor: target.statusColor,
                    statusCategory: target.category,
                  },
                ],
              }
            : c;
        }
        return c;
      }),
    );
    try {
      await transitionTicket(ticketId, target.statusId);
    } catch (err) {
      setColumns(previous);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to move ticket. It has been reverted.",
      );
    }
  };
  const saveConfiguration = async (form, rows) => {
    const [cfg, cols] = await Promise.all([
      updateBoardConfig(Number(selectedProjectId), form),
      updateBoardColumns(Number(selectedProjectId), rows),
    ]);
    setConfig(cfg);
    setColumnConfig(cols);
    setConfigOpen(false);
    await loadBoard(selectedProjectId, true);
    toast.success("Board configuration saved.");
  };
  const selectedProject = projects.find(
    (p) => Number(p.id) === Number(selectedProjectId),
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Kanban Board
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage workflow, WIP limits, swimlanes and board configuration
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Board configuration">
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => setConfigOpen(true)}
              disabled={!selectedProjectId}
            >
              Configure
            </Button>
          </Tooltip>
          <Tooltip title="Cumulative flow">
            <Button
              variant="outlined"
              startIcon={<TimelineIcon />}
              onClick={() => setCfdOpen(true)}
              disabled={!selectedProjectId}
            >
              Cumulative Flow
            </Button>
          </Tooltip>
          <Tooltip title="Status history">
            <Button
              variant="outlined"
              startIcon={<TimelineIcon />}
              onClick={() => setHistoryOpen(true)}
              disabled={!selectedProjectId}
            >
              History
            </Button>
          </Tooltip>
          <Tooltip title="Refresh board">
            <span>
              <Button
                variant="outlined"
                startIcon={
                  refreshing ? <CircularProgress size={17} /> : <RefreshIcon />
                }
                onClick={() => loadBoard(selectedProjectId, true)}
                disabled={refreshing || !selectedProjectId}
              >
                Refresh
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <FormControl fullWidth>
            <InputLabel>Project</InputLabel>
            <Select
              value={selectedProjectId}
              label="Project"
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {projects.map((p) => (
                <MenuItem key={p.id} value={String(p.id)}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
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
        <Card>
          <CardContent>
            <Typography color="text.secondary" textAlign="center">
              No projects available.
            </Typography>
          </CardContent>
        </Card>
      ) : loading ? (
        <Box
          sx={{
            minHeight: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack spacing={2} alignItems="center">
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Loading board...
            </Typography>
          </Stack>
        </Box>
      ) : (
        <Box>
          {activeSprint && config?.activeSprintOnly !== false ? (
            <Alert
              severity="success"
              icon={<ViewKanbanIcon fontSize="inherit" />}
              sx={{ mb: 2 }}
              action={
                <Button
                  size="small"
                  color="inherit"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/admin/backlog")}
                >
                  View in backlog
                </Button>
              }
            >
              Showing active sprint <strong>{activeSprint.name}</strong>
            </Alert>
          ) : (
            <Alert
              severity="info"
              icon={<InfoOutlinedIcon fontSize="inherit" />}
              sx={{ mb: 2 }}
            >
              Showing all board tickets. Enable active-sprint-only in board
              configuration if required.
            </Alert>
          )}
          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
          >
            <Chip label={`Total: ${totalTicketCount}`} variant="outlined" />
            {displayColumns.map((c) => (
              <Chip
                key={c.statusId}
                label={`${c.displayName || c.statusName}: ${c.tickets?.length || 0}${c.wipLimit ? `/${c.wipLimit}` : ""}`}
                variant="outlined"
                sx={{
                  borderColor: c.statusColor || undefined,
                  color: c.statusColor || undefined,
                }}
              />
            ))}
          </Stack>
          {displayColumns.length === 0 ? (
            <Card>
              <CardContent>
                <Typography color="text.secondary" textAlign="center">
                  This project has no board columns configured.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Stack spacing={2}>
              {lanes.map((lane) => (
                <Box key={lane.key}>
                  {lane.label && (
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{ mb: 1 }}
                    >
                      {lane.label}
                    </Typography>
                  )}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: `repeat(${Math.min(displayColumns.length, 4)},minmax(260px,1fr))`,
                      },
                      gap: 2,
                      overflowX: "auto",
                    }}
                  >
                    {lane.columns.map((c) => (
                      <BoardColumn
                        key={`${lane.key}-${c.statusId}`}
                        column={c}
                        tickets={c.tickets || []}
                        onTicketClick={(id) => navigate(`/admin/tickets/${id}`)}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
          {selectedProject && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 2, display: "block" }}
            >
              Project: {selectedProject.name} · Swimlanes:{" "}
              {config?.swimlaneType || "NONE"} · WIP enforcement:{" "}
              {config?.enforceWip ? "On" : "Off"}
            </Typography>
          )}
        </Box>
      )}
      <KanbanBoardConfigDialog
        open={configOpen}
        config={config}
        columns={columnConfig}
        onClose={() => setConfigOpen(false)}
        onSave={saveConfiguration}
      />
      <KanbanCumulativeFlowDialog
        open={cfdOpen}
        projectId={Number(selectedProjectId)}
        columns={displayColumns}
        onClose={() => setCfdOpen(false)}
      />
      <BoardHistoryDialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        projectId={selectedProjectId}
      />
    </Box>
  );
}
