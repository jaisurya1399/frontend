import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { getActiveProjects } from "../../api/projectApi";
import {
  createProjectTeam,
  deleteProjectTeam,
  getProjectTeams,
} from "../../api/projectTeamApi";
export default function ProjectTeams() {
  const [p, setP] = useState([]),
    [pid, setPid] = useState(""),
    [teams, setTeams] = useState([]),
    [open, setOpen] = useState(false),
    [name, setName] = useState(""),
    [desc, setDesc] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    getActiveProjects()
      .then(setP)
      .catch((e) =>
        setError(e.response?.data?.message || "Unable to load projects"),
      );
  }, []);
  const load = async () => {
    if (pid)
      try {
        setTeams(await getProjectTeams(pid));
      } catch (e) {
        setError(e.response?.data?.message || "Unable to load teams");
      }
  };
  useEffect(() => {
    load();
  }, [pid]);
  const save = async () => {
    try {
      await createProjectTeam({
        projectId: Number(pid),
        name,
        description: desc,
      });
      setOpen(false);
      setName("");
      setDesc("");
      load();
    } catch (e) {
      setError(e.response?.data?.message || "Unable to create team");
    }
  };
  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Project Teams
      </Typography>
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          select
          label="Project"
          value={pid}
          onChange={(e) => setPid(e.target.value)}
          sx={{ minWidth: 280 }}
        >
          {p.map((x) => (
            <MenuItem key={x.id} value={x.id}>
              {x.name}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          disabled={!pid}
          onClick={() => setOpen(true)}
        >
          New Team
        </Button>
      </Stack>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Stack spacing={1}>
        {teams.map((t) => (
          <Card key={t.id}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography fontWeight={700}>{t.name}</Typography>
                  <Typography variant="body2">
                    {t.description || "No description"} ·{" "}
                    {t.memberNames?.length || 0} members
                  </Typography>
                </Box>
                <Button
                  color="error"
                  onClick={async () => {
                    await deleteProjectTeam(t.id);
                    load();
                  }}
                >
                  Disable
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Project Team</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={!name.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
