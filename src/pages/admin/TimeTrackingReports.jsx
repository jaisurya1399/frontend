import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { getTimeTrackingReport } from "../../api/timeTrackingApi";

const hours = (v) => `${Number(v || 0).toFixed(2)}h`;

export default function TimeTrackingReports() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      setRows(
        await getTimeTrackingReport({
          from: from || undefined,
          to: to || undefined,
        }),
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const totals = useMemo(
    () =>
      rows.reduce(
        (a, r) => ({
          estimate: a.estimate + Number(r.estimatedHours || 0),
          actual: a.actual + Number(r.actualHours || 0),
        }),
        { estimate: 0, actual: 0 },
      ),
    [rows],
  );
  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Time Tracking Reports
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            type="date"
            label="From"
            InputLabelProps={{ shrink: true }}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <TextField
            type="date"
            label="To"
            InputLabelProps={{ shrink: true }}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <Button variant="contained" onClick={load}>
            Run Report
          </Button>
        </Stack>
      </Paper>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography color="text.secondary">Estimated</Typography>
          <Typography variant="h6">{hours(totals.estimate)}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography color="text.secondary">Actual</Typography>
          <Typography variant="h6">{hours(totals.actual)}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography color="text.secondary">Variance</Typography>
          <Typography variant="h6">
            {hours(totals.actual - totals.estimate)}
          </Typography>
        </Paper>
      </Stack>
      <Paper sx={{ overflowX: "auto" }}>
        <Box
          component="table"
          sx={{
            width: "100%",
            borderCollapse: "collapse",
            "th,td": {
              p: 1.5,
              borderBottom: "1px solid",
              borderColor: "divider",
              textAlign: "left",
            },
          }}
        >
          <thead>
            <tr>
              <th>Ticket</th>
              <th>User</th>
              <th>Estimated</th>
              <th>Actual</th>
              <th>Remaining</th>
              <th>Variance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.ticketId}-${r.userId}`}>
                <td>
                  {r.ticketCode} — {r.ticketName}
                </td>
                <td>{r.userName || r.userEmail}</td>
                <td>{hours(r.estimatedHours)}</td>
                <td>{hours(r.actualHours)}</td>
                <td>{hours(r.remainingEstimateHours)}</td>
                <td>{hours(r.varianceHours)}</td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6}>No time records found.</td>
              </tr>
            )}
          </tbody>
        </Box>
      </Paper>
    </Box>
  );
}
