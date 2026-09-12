import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import CommandSearch from "../common/CommandSearch";
import NotificationBell from "../notifications/NotificationBell";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BORDER, PRIMARY, TOPBAR } from "../../theme/colors";

const SEARCH_ITEMS = [
  ["Dashboard", "/developer"],
  ["My Projects", "/developer/projects"],
  ["My Tasks", "/developer/tasks"],
  ["Board", "/developer/board"],
  ["Daily Scrum", "/developer/daily-scrum"],
  ["AI Project Manager", "/developer/ai-pm"],
  ["Reminders", "/developer/reminders"],
  ["Notifications", "/developer/notifications"],
  ["Timesheet", "/developer/timesheet"],
  ["Availability", "/developer/availability"],
  ["Profile", "/developer/profile"],
].map(([label, path]) => ({ label, path, group: "Workspace" }));

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [createAnchor, setCreateAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);
  const userName = user?.name || user?.username || "Team Member";
  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  const notificationClick = (notification) => {
    if (!notification) return navigate("/developer/notifications");
    try {
      const d =
        typeof notification.data === "string"
          ? JSON.parse(notification.data)
          : notification.data;
      if (d?.ticketId) return navigate(`/developer/tickets/${d.ticketId}`);
      if (d?.taskId) return navigate("/developer/tasks");
      if (d?.projectId) return navigate("/developer/projects");
    } catch {
      // Malformed notification payload — fall through to the default route.
    }
    navigate("/developer/notifications");
  };
  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: TOPBAR.background,
          backdropFilter: "blur(14px)",
          boxShadow:
            "0 1px 0 rgba(16,24,40,.02), 0 6px 24px rgba(16,24,40,.025)",
          color: TOPBAR.textPrimary,
          borderBottom: `1px solid ${BORDER}`,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            minHeight: `${TOPBAR.height}px !important`,
            px: { xs: 1, sm: 2, md: 2.5 },
            gap: 1,
          }}
        >
          <IconButton
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { xs: "none", sm: "block" }, minWidth: 170 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 800 }}>
              Team Workspace
            </Typography>
            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
              Plan, collaborate and deliver
            </Typography>
          </Box>
          <Button
            onClick={() => setSearchOpen(true)}
            startIcon={<SearchRoundedIcon fontSize="small" />}
            sx={{
              flex: 1,
              maxWidth: 560,
              mx: { xs: 0, md: "auto" },
              justifyContent: "flex-start",
              textTransform: "none",
              color: "text.secondary",
              bgcolor: "#F8F9FC",
              border: `1px solid ${BORDER}`,
              borderRadius: 2.5,
              minHeight: 40,
              px: 1.5,
              "&:hover": { bgcolor: "#F1F3F8" },
            }}
          >
            Search projects, tasks and people...
          </Button>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: "auto" }}
          >
            <NotificationBell
              userId={user?.userId ?? user?.id}
              notifiableType="User"
              onNotificationClick={notificationClick}
            />
            <IconButton
              onClick={(e) => setUserAnchor(e.currentTarget)}
              aria-label="Open profile menu"
            >
              <Avatar
                src={user?.avatarUrl}
                alt={userName}
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: PRIMARY,
                  fontSize: 13,
                  fontWeight: 750,
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={createAnchor}
        open={Boolean(createAnchor)}
        onClose={() => setCreateAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setCreateAnchor(null);
            navigate("/developer/projects/create");
          }}
        >
          Create project
        </MenuItem>
        <MenuItem
          onClick={() => {
            setCreateAnchor(null);
            navigate("/developer/tasks");
          }}
        >
          Create task
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={userAnchor}
        open={Boolean(userAnchor)}
        onClose={() => setUserAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setUserAnchor(null);
            navigate("/developer/profile");
          }}
        >
          <PersonOutlineRoundedIcon sx={{ mr: 1.25, fontSize: 19 }} />
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            setUserAnchor(null);
            logout();
          }}
        >
          <LogoutIcon sx={{ mr: 1.25, fontSize: 19 }} />
          Sign out
        </MenuItem>
      </Menu>
      <CommandSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        items={SEARCH_ITEMS}
      />
    </>
  );
}
