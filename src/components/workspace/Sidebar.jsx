import Close from "@mui/icons-material/Close";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import {
  AccessTimeOutlined,
  AssignmentOutlined,
  DashboardOutlined,
  EventAvailableOutlined,
  FolderOutlined,
  GroupsOutlined,
  NotificationsNoneOutlined,
  PersonOutline,
  Security as SecurityIcon,
  ViewKanbanOutlined,
} from "@mui/icons-material";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MOTION, PRIORITY_COLORS, RADIUS, SIDEBAR } from "../../theme/colors";

export const DRAWER_WIDTH = SIDEBAR.width;

const NAV_SECTIONS = [
  // ============================================================
  // OVERVIEW
  // ============================================================
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/developer",
        icon: DashboardOutlined,
      },
      {
        label: "My Projects",
        path: "/developer/projects",
        icon: FolderOutlined,
        permission: "project.view",
      },
      {
        label: "My Tasks",
        path: "/developer/tasks",
        icon: AssignmentOutlined,
      },
      {
        label: "Board",
        path: "/developer/board",
        icon: ViewKanbanOutlined,
        permission: "ticket.view",
      },
      {
        label: "Daily Scrum",
        path: "/developer/daily-scrum",
        icon: GroupsOutlined,
      },
      {
        label: "AI Project Manager",
        path: "/developer/ai-pm",
        icon: DashboardOutlined,
        permission: "project.view",
      },
      {
        label: "Reminders",
        path: "/developer/reminders",
        icon: EventAvailableOutlined,
      },
    ],
  },

  // ============================================================
  // GENERAL
  // ============================================================
  {
    title: "General",
    items: [
      {
        label: "Notifications",
        path: "/developer/notifications",
        icon: NotificationsNoneOutlined,
      },
      {
        label: "Team Chat & Meetings",
        path: "/developer/communication",
        icon: GroupsOutlined,
      },
    ],
  },

  // ============================================================
  // TIME
  // ============================================================
  {
    title: "Time",
    items: [
      {
        label: "Timesheet",
        path: "/developer/timesheet",
        icon: AccessTimeOutlined,
      },
      {
        label: "Availability",
        path: "/developer/availability",
        icon: EventAvailableOutlined,
      },
    ],
  },

  // ============================================================
  // ACCOUNT
  // ============================================================
  {
    title: "Account",
    items: [
      {
        label: "Profile",
        path: "/developer/profile",
        icon: PersonOutline,
      },
      {
        label: "Security",
        path: "/developer/security",
        icon: SecurityIcon,
      },
    ],
  },
];

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const { logout, hasPermission, isSystemAdmin, user } = useAuth();

  const roleLabel = isSystemAdmin()
    ? "System Administrator"
    : String(user?.role || "Team Member")
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: SIDEBAR.background,
        color: SIDEBAR.itemText,
      }}
    >
      {/* ========================================================
          HEADER
      ======================================================== */}
      <Box
        sx={{
          height: 68,
          px: 2.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${SIDEBAR.border}`,
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 13,
            boxShadow: "0 8px 20px rgba(79,70,229,.24)",
          }}
        >
          PM
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: "-0.3px",
              color: "#FFFFFF",
            }}
          >
            Project Management
          </Typography>

          <Typography
            sx={{
              fontSize: 11,
              color: "#94A3B8",
              mt: 0.2,
            }}
          >
            {roleLabel}
          </Typography>
        </Box>

        {/* Mobile Close */}
        <IconButton
          onClick={onClose}
          sx={{
            display: {
              xs: "flex",
              md: "none",
            },
            color: "#94A3B8",
          }}
        >
          <Close />
        </IconButton>
      </Box>

      {/* ========================================================
          NAVIGATION
      ======================================================== */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 1.25,
          py: 1.75,
          scrollbarWidth: "thin",
        }}
      >
        {NAV_SECTIONS.map((section) => {
          const visibleItems = section.items.filter(
            (item) => !item.permission || hasPermission(item.permission),
          );

          if (!visibleItems.length) return null;

          return (
            <Box key={section.title} sx={{ mb: 2 }}>
              {/* Section Title */}
              <Typography
                sx={{
                  px: 1.5,
                  mb: 0.8,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: SIDEBAR.sectionHeader,
                }}
              >
                {section.title}
              </Typography>

              <List disablePadding>
                {visibleItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <ListItemButton
                      key={item.path}
                      component={NavLink}
                      to={item.path}
                      end={item.path === "/developer"}
                      onClick={onClose}
                      sx={{
                        position: "relative",
                        minHeight: 42,
                        mb: 0.35,
                        pl: 1.75,
                        pr: 1.5,
                        borderRadius: `${RADIUS.button}px`,
                        color: SIDEBAR.itemText,
                        textDecoration: "none",
                        transition: `background-color ${MOTION.fast} ${MOTION.easing}, color ${MOTION.fast} ${MOTION.easing}, transform ${MOTION.fast} ${MOTION.easingOut}`,

                        // Active indicator is an absolutely-positioned pill
                        // that animates in on scale, rather than a hard
                        // border — reads as intentional, not a layout shift.
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 2,
                          top: "22%",
                          bottom: "22%",
                          width: 3,
                          borderRadius: 3,
                          backgroundColor: SIDEBAR.itemSelectedIndicator,
                          transform: "scaleY(0)",
                          transition: `transform ${MOTION.base} ${MOTION.easingOut}`,
                        },

                        "& .MuiListItemIcon-root": {
                          minWidth: 36,
                          color: "#94A3B8",
                          transition: `color ${MOTION.fast} ${MOTION.easing}`,
                        },

                        "&:hover": {
                          bgcolor: SIDEBAR.itemHoverBg,
                          color: SIDEBAR.itemText,
                          transform: "translateX(1px)",
                        },

                        "&.active": {
                          color: SIDEBAR.itemSelectedText,
                          background: SIDEBAR.itemSelectedBg,
                          fontWeight: 650,
                          boxShadow: "inset 0 0 0 1px rgba(29,78,216,.04)",
                        },

                        "&.active::before": {
                          transform: "scaleY(1)",
                        },

                        "&.active .MuiListItemIcon-root": {
                          color: SIDEBAR.itemSelectedText,
                        },
                      }}
                    >
                      <ListItemIcon>
                        <Icon fontSize="small" />
                      </ListItemIcon>

                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Box>
          );
        })}
      </Box>

      {/* ========================================================
          LOGOUT
      ======================================================== */}
      <Box
        sx={{
          p: 1.25,
          borderTop: `1px solid ${SIDEBAR.border}`,
        }}
      >
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: `${RADIUS.button}px`,
            color: PRIORITY_COLORS.HIGHEST,

            "&:hover": {
              bgcolor: "rgba(205, 19, 23, 0.08)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 34,
              color: "inherit",
            }}
          >
            <LogoutOutlined fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: 600,
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* ========================================================
          DESKTOP SIDEBAR
      ======================================================== */}
      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: "none",
            md: "block",
          },

          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            border: "none",
            borderRight: `1px solid ${SIDEBAR.border}`,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* ========================================================
          MOBILE SIDEBAR
      ======================================================== */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },

          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            border: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
