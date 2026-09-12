import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { getBoardHistory } from "../../api/boardApi";
export default function BoardHistoryDialog({ open, onClose, projectId }) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (open && projectId)
      getBoardHistory(projectId, 30)
        .then(setRows)
        .catch(() => setRows([]));
  }, [open, projectId]);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Board Status History</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          {rows.length ? (
            rows.map((x) => (
              <Stack key={x.id} direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">
                  {x.ticket?.code || `Ticket #${x.ticket?.id || ""}`}
                </Typography>
                <Chip size="small" label={x.fromStatus?.name || "Created"} />
                <Typography>→</Typography>
                <Chip size="small" label={x.toStatus?.name || "—"} />
                <Typography variant="caption" color="text.secondary">
                  {x.changedAt ? new Date(x.changedAt).toLocaleString() : ""}
                </Typography>
              </Stack>
            ))
          ) : (
            <Typography color="text.secondary">
              No status transitions in the last 30 days.
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
