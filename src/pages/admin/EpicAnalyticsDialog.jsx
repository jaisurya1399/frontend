import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";

import {
  getEpicBurndown,
  getEpicProgress,
  getEpicReport,
} from "../../api/epicApi";

const number = (value) => Number(value || 0).toLocaleString();
const points = (value) => Number(value || 0).toFixed(2);
const pct = (value) => `${Number(value || 0).toFixed(1)}%`;

const StatCard = ({ label, value, secondary }) => (
  <Paper variant="outlined" sx={{ p: 2, minWidth: 150, flex: 1 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h5" fontWeight={700} mt={0.5}>
      {value}
    </Typography>
    {secondary && (
      <Typography variant="caption" color="text.secondary">
        {secondary}
      </Typography>
    )}
  </Paper>
);

const BarList = ({ title, data }) => {
  const entries = Object.entries(data || {});
  const max = Math.max(1, ...entries.map(([, value]) => Number(value || 0)));

  return (
    <Box>
      <Typography fontWeight={700} mb={1.5}>
        {title}
      </Typography>
      <Stack spacing={1.2}>
        {entries.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No data available.
          </Typography>
        ) : (
          entries.map(([label, value]) => (
            <Box key={label}>
              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2">{label}</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {value}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={(Number(value || 0) / max) * 100}
                sx={{ height: 7, borderRadius: 5 }}
              />
            </Box>
          ))
        )}
      </Stack>
    </Box>
  );
};

const BurndownChart = ({ points: data }) => {
  const width = 900;
  const height = 330;
  const pad = { left: 55, right: 25, top: 25, bottom: 55 };
  const innerWidth = width - pad.left - pad.right;
  const innerHeight = height - pad.top - pad.bottom;

  const maxValue = Math.max(
    1,
    ...(data || []).flatMap((item) => [
      Number(item.idealRemaining || 0),
      Number(item.remaining || 0),
    ]),
  );

  const x = (index) =>
    pad.left +
    (data.length <= 1
      ? innerWidth / 2
      : (index / (data.length - 1)) * innerWidth);

  const y = (value) =>
    pad.top + innerHeight - (Number(value || 0) / maxValue) * innerHeight;

  const makePath = (key) =>
    data
      .map(
        (item, index) =>
          `${index === 0 ? "M" : "L"} ${x(index)} ${y(item[key])}`,
      )
      .join(" ");

  if (!data?.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        No burndown data available.
      </Typography>
    );
  }

  const labels =
    data.length <= 7
      ? data
      : [data[0], data[Math.floor(data.length / 2)], data[data.length - 1]];

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        role="img"
        aria-label="Epic burndown chart"
      >
        <line
          x1={pad.left}
          y1={pad.top}
          x2={pad.left}
          y2={height - pad.bottom}
          stroke="currentColor"
          opacity="0.25"
        />
        <line
          x1={pad.left}
          y1={height - pad.bottom}
          x2={width - pad.right}
          y2={height - pad.bottom}
          stroke="currentColor"
          opacity="0.25"
        />

        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const value = maxValue * ratio;
          const yy = y(value);
          return (
            <g key={ratio}>
              <line
                x1={pad.left}
                y1={yy}
                x2={width - pad.right}
                y2={yy}
                stroke="currentColor"
                opacity="0.08"
              />
              <text
                x={pad.left - 8}
                y={yy + 4}
                textAnchor="end"
                fontSize="11"
                fill="currentColor"
              >
                {value.toFixed(0)}
              </text>
            </g>
          );
        })}

        <path
          d={makePath("idealRemaining")}
          fill="none"
          stroke="currentColor"
          strokeDasharray="6 5"
          opacity="0.45"
          strokeWidth="2"
        />
        <path
          d={makePath("remaining")}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />

        {data.map((item, index) => (
          <circle
            key={item.date}
            cx={x(index)}
            cy={y(item.remaining)}
            r="3.5"
            fill="currentColor"
          />
        ))}

        {labels.map((item) => {
          const index = data.findIndex((point) => point.date === item.date);
          return (
            <text
              key={item.date}
              x={x(index)}
              y={height - 25}
              textAnchor="middle"
              fontSize="11"
              fill="currentColor"
            >
              {item.date}
            </text>
          );
        })}
      </svg>

      <Stack direction="row" spacing={2} justifyContent="center" mt={-1}>
        <Typography variant="caption">— Actual remaining</Typography>
        <Typography variant="caption">- - Ideal remaining</Typography>
      </Stack>
    </Box>
  );
};

const EpicAnalyticsDialog = ({ open, onClose, epic }) => {
  const [tab, setTab] = useState(0);
  const [progress, setProgress] = useState(null);
  const [burndown, setBurndown] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !epic?.id) return;

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [progressData, burndownData, reportData] = await Promise.all([
          getEpicProgress(epic.id),
          getEpicBurndown(epic.id),
          getEpicReport(epic.id),
        ]);

        if (!cancelled) {
          setProgress(progressData);
          setBurndown(burndownData);
          setReport(reportData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message || "Failed to load Epic analytics",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [open, epic?.id]);

  const issues = useMemo(() => report?.issues || [], [report]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={1}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {epic?.name || "Epic"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Epic Progress, Burndown and Report
            </Typography>
          </Box>
          {epic && (
            <Chip
              label={`${epic.startsAt || ""} → ${epic.endsAt || ""}`}
              variant="outlined"
            />
          )}
        </Stack>
      </DialogTitle>

      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Progress" />
        <Tab label="Burndown" />
        <Tab label="Report" />
      </Tabs>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {loading && <LinearProgress sx={{ mb: 3 }} />}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {tab === 0 && progress && (
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              flexWrap="wrap"
            >
              <StatCard
                label="Total Issues"
                value={number(progress.totalIssues)}
              />
              <StatCard
                label="Completed"
                value={number(progress.completedIssues)}
              />
              <StatCard
                label="In Progress"
                value={number(progress.inProgressIssues)}
              />
              <StatCard label="To Do" value={number(progress.todoIssues)} />
              <StatCard
                label="Remaining"
                value={number(progress.totalIssues - progress.completedIssues)}
              />
            </Stack>

            <Paper variant="outlined" sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography fontWeight={700}>Issue Completion</Typography>
                <Typography fontWeight={700}>
                  {pct(progress.completionPercentage)}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={Math.min(
                  100,
                  Math.max(0, progress.completionPercentage || 0),
                )}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Paper>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <StatCard
                label="Total Estimation"
                value={points(progress.totalEstimation)}
              />
              <StatCard
                label="Completed Estimation"
                value={points(progress.completedEstimation)}
              />
              <StatCard
                label="Remaining Estimation"
                value={points(progress.remainingEstimation)}
              />
              <StatCard
                label="Estimation Progress"
                value={pct(progress.estimationCompletionPercentage)}
              />
            </Stack>
          </Stack>
        )}

        {tab === 1 && burndown && (
          <Stack spacing={3}>
            <Paper variant="outlined" sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={700} mb={0.5}>
                Epic Burndown
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Remaining estimation by day against the ideal burndown.
              </Typography>
              <BurndownChart points={burndown.points} />
            </Paper>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <StatCard
                label="Total Estimation"
                value={points(burndown.totalEstimation)}
              />
              <StatCard label="Start" value={burndown.startsAt || "-"} />
              <StatCard label="End" value={burndown.endsAt || "-"} />
              <StatCard
                label="Data Points"
                value={number(burndown.points?.length)}
              />
            </Stack>
          </Stack>
        )}

        {tab === 2 && report && (
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              flexWrap="wrap"
            >
              <StatCard label="Issues" value={number(report.totalIssues)} />
              <StatCard
                label="Completed"
                value={number(report.completedIssues)}
              />
              <StatCard
                label="Completion"
                value={pct(report.completionPercentage)}
              />
              <StatCard
                label="Estimation Progress"
                value={pct(report.estimationCompletionPercentage)}
              />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
              <Paper variant="outlined" sx={{ p: 2.5, flex: 1 }}>
                <BarList
                  title="Status Distribution"
                  data={report.statusDistribution}
                />
              </Paper>
              <Paper variant="outlined" sx={{ p: 2.5, flex: 1 }}>
                <BarList
                  title="Priority Distribution"
                  data={report.priorityDistribution}
                />
              </Paper>
            </Stack>

            <Paper variant="outlined" sx={{ overflow: "hidden" }}>
              <Box sx={{ p: 2 }}>
                <Typography fontWeight={700}>
                  Epic Issues ({issues.length})
                </Typography>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell align="right">Estimation</TableCell>
                    <TableCell>Responsible</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {issues.map((issue) => (
                    <TableRow key={issue.id} hover>
                      <TableCell>{issue.code || `#${issue.id}`}</TableCell>
                      <TableCell>{issue.name}</TableCell>
                      <TableCell>{issue.status || "-"}</TableCell>
                      <TableCell>{issue.priority || "-"}</TableCell>
                      <TableCell align="right">
                        {points(issue.estimation)}
                      </TableCell>
                      <TableCell>{issue.responsibleName || "-"}</TableCell>
                    </TableRow>
                  ))}
                  {issues.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No active tickets in this Epic.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EpicAnalyticsDialog;
