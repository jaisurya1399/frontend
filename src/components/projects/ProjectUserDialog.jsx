import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { getUsers } from "../../api/userApi";

const ACCESS_LEVELS = [
  {
    value: "PROJECT_ADMIN",
    label: "Project Admin",
    description:
      "Manage this project's settings, members and delivery configuration.",
  },
  {
    value: "MEMBER",
    label: "Member",
    description:
      "Work on project items according to the selected responsibility.",
  },
  {
    value: "VIEWER",
    label: "Viewer",
    description: "Read-only access to project information and reporting.",
  },
];

const RESPONSIBILITIES = [
  ["DEVELOPER", "Developer"],
  ["TESTER", "Tester / QA"],
  ["TEAM_LEAD", "Team Lead"],
  ["SCRUM_MASTER", "Scrum Master"],
  ["PRODUCT_OWNER", "Product Owner"],
  ["BUSINESS_ANALYST", "Business Analyst"],
];

export default function ProjectUserDialog({
  open,
  projectId,
  assignment,
  onClose,
  onSave,
}) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    userId: "",
    role: "MEMBER",
    responsibilityRole: "DEVELOPER",
  });

  const selectedAccess = useMemo(
    () => ACCESS_LEVELS.find((item) => item.value === form.role),
    [form.role],
  );

  useEffect(() => {
    if (!open) return;

    setError("");
    setLoadingUsers(true);

    getUsers()
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => {
        setUsers([]);
        setError(
          err.response?.data?.message || err.message || "Unable to load users.",
        );
      })
      .finally(() => setLoadingUsers(false));

    if (assignment) {
      setForm({
        userId: String(assignment.userId || ""),
        role: String(assignment.role || "MEMBER").toUpperCase(),
        responsibilityRole: String(
          assignment.responsibilityRole || "DEVELOPER",
        ).toUpperCase(),
      });
    } else {
      setForm({
        userId: "",
        role: "MEMBER",
        responsibilityRole: "DEVELOPER",
      });
    }
  }, [open, assignment]);

  const handleRoleChange = (role) => {
    setForm((current) => ({
      ...current,
      role,
      responsibilityRole:
        role === "MEMBER" ? current.responsibilityRole || "DEVELOPER" : "",
    }));
  };

  const handleSave = async () => {
    if (!form.userId) {
      setError("Please select a user.");
      return;
    }

    if (!form.role) {
      setError("Please select a project access level.");
      return;
    }

    if (form.role === "MEMBER" && !form.responsibilityRole) {
      setError("Please select a member responsibility.");
      return;
    }

    setError("");

    try {
      await onSave({
        userId: Number(form.userId),
        projectId: Number(projectId),
        role: form.role,
        responsibilityRole:
          form.role === "MEMBER" ? form.responsibilityRole : null,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save project access.",
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle sx={{ px: 3, pt: 3, pb: 1.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              width: 42,
              height: 42,
              bgcolor: "primary.main",
            }}
          >
            {assignment ? (
              <SecurityOutlinedIcon fontSize="small" />
            ) : (
              <PersonAddAltOutlinedIcon fontSize="small" />
            )}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={800}>
              {assignment ? "Edit Project Access" : "Add Project Member"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure project access independently from team responsibility.
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        <Stack spacing={2.5}>
          {error && (
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <FormControl fullWidth required>
            <InputLabel>User</InputLabel>
            <Select
              value={form.userId}
              label="User"
              disabled={Boolean(assignment) || loadingUsers}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  userId: event.target.value,
                }))
              }
            >
              {users.length === 0 ? (
                <MenuItem disabled>
                  {loadingUsers ? "Loading users..." : "No users available"}
                </MenuItem>
              ) : (
                users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>
                        {(user.name || user.email || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {user.name || "Unnamed user"}
                        </Typography>
                        {user.email && (
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </MenuItem>
                ))
              )}
            </Select>
            {assignment && (
              <FormHelperText>
                User cannot be changed while editing an existing assignment.
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>Project Access</InputLabel>
            <Select
              value={form.role}
              label="Project Access"
              onChange={(event) => handleRoleChange(event.target.value)}
            >
              {ACCESS_LEVELS.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  <Box>
                    <Typography variant="body2" fontWeight={700}>
                      {item.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedAccess && (
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: 2,
                bgcolor: "action.hover",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <SecurityOutlinedIcon fontSize="small" color="primary" />
                <Typography variant="body2" fontWeight={700}>
                  {selectedAccess.label}
                </Typography>
                <Chip
                  label="Access level"
                  size="small"
                  variant="outlined"
                  sx={{ ml: "auto" }}
                />
              </Stack>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5, ml: 3.5 }}
              >
                {selectedAccess.description}
              </Typography>
            </Box>
          )}

          {form.role === "MEMBER" && (
            <FormControl fullWidth required>
              <InputLabel>Member Responsibility</InputLabel>
              <Select
                value={form.responsibilityRole}
                label="Member Responsibility"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    responsibilityRole: event.target.value,
                  }))
                }
              >
                {RESPONSIBILITIES.map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <WorkOutlineOutlinedIcon
                        fontSize="small"
                        color="action"
                      />
                      <Typography variant="body2">{label}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                This describes what the member is responsible for; it does not
                replace project access.
              </FormHelperText>
            </FormControl>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.default",
        }}
      >
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={
            loadingUsers ||
            !form.userId ||
            !form.role ||
            (form.role === "MEMBER" && !form.responsibilityRole)
          }
        >
          {assignment ? "Save Changes" : "Add Member"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
