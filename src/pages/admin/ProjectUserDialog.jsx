import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";

import { useEffect, useState } from "react";
import { getUsers } from "../../api/userApi";

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
  const [form, setForm] = useState({
    userId: "",
    role: "MEMBER",
    responsibilityRole: "DEVELOPER",
  });

  useEffect(() => {
    if (!open) return;
    getUsers()
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(console.error);
    if (assignment) {
      setForm({
        userId: assignment.userId || "",
        role: assignment.role || "MEMBER",
        responsibilityRole: assignment.responsibilityRole || "DEVELOPER",
      });
    } else {
      setForm({ userId: "", role: "MEMBER", responsibilityRole: "DEVELOPER" });
    }
  }, [open, assignment]);

  const handleRoleChange = (role) =>
    setForm((current) => ({
      ...current,
      role,
      responsibilityRole:
        role === "MEMBER" ? current.responsibilityRole || "DEVELOPER" : "",
    }));

  const handleSave = async () => {
    await onSave({
      userId: Number(form.userId),
      projectId: Number(projectId),
      role: form.role,
      responsibilityRole:
        form.role === "MEMBER" ? form.responsibilityRole : null,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {assignment ? "Edit Project Member" : "Assign User"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormControl fullWidth required>
            <InputLabel>User</InputLabel>
            <Select
              value={form.userId}
              label="User"
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name || user.email || `User ${user.id}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel>Project Access</InputLabel>
            <Select
              value={form.role}
              label="Project Access"
              onChange={(e) => handleRoleChange(e.target.value)}
            >
              <MenuItem value="PROJECT_ADMIN">Project Admin</MenuItem>
              <MenuItem value="MEMBER">Member</MenuItem>
              <MenuItem value="VIEWER">Viewer</MenuItem>
            </Select>
          </FormControl>
          {form.role === "MEMBER" && (
            <FormControl fullWidth required>
              <InputLabel>Responsibility</InputLabel>
              <Select
                value={form.responsibilityRole}
                label="Responsibility"
                onChange={(e) =>
                  setForm({ ...form, responsibilityRole: e.target.value })
                }
              >
                {RESPONSIBILITIES.map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={
            !form.userId ||
            !form.role ||
            (form.role === "MEMBER" && !form.responsibilityRole)
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
