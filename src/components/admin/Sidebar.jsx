import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import ViewKanbanRoundedIcon from "@mui/icons-material/ViewKanbanRounded";
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  BORDER,
  MOTION,
  PRIMARY,
  PRIORITY_COLORS,
  SIDEBAR,
  TEXT_SECONDARY,
} from "../../theme/colors";

export const DRAWER_WIDTH = 252;

const SECTIONS = [
  {
    title: "Work",
    icon: DashboardRoundedIcon,
    items: [
      ["Overview", "/admin", DashboardRoundedIcon],
      ["Projects", "/admin/projects", FolderRoundedIcon, "project.view"],
      ["Tickets", "/admin/tickets", ConfirmationNumberRoundedIcon],
      [
        "Backlog",
        "/admin/backlog",
        ConfirmationNumberRoundedIcon,
        "ticket.view",
      ],
      ["Board", "/admin/board", ViewKanbanRoundedIcon, "ticket.view"],
    ],
  },
  {
    title: "Planning",
    icon: MapRoundedIcon,
    items: [
      ["Epics", "/admin/epics", FlagRoundedIcon, "epic.view"],
      ["Roadmap", "/admin/roadmap", MapRoundedIcon],
      ["Milestones", "/admin/milestones", FlagRoundedIcon],
      ["Releases & Versions", "/admin/releases", FlagRoundedIcon],
      ["Daily Scrum", "/admin/daily-scrum", GroupsRoundedIcon],
    ],
  },
  {
    title: "Insights",
    icon: InsightsRoundedIcon,
    items: [
      [
        "Dashboards & Analytics",
        "/admin/dashboard-analytics",
        InsightsRoundedIcon,
      ],
      [
        "Enterprise Reports",
        "/admin/enterprise-reports",
        AssessmentRoundedIcon,
      ],
      [
        "Enterprise Management",
        "/admin/enterprise-management",
        AssessmentRoundedIcon,
      ],
      ["Activities", "/admin/activities", TimelineRoundedIcon],
      [
        "AI Project Manager",
        "/admin/ai-pm",
        AutoAwesomeRoundedIcon,
        "project.view",
      ],
    ],
  },
  {
    title: "People",
    icon: GroupsRoundedIcon,
    items: [
      ["Users", "/admin/users", GroupsRoundedIcon, "user.view"],
      [
        "User Groups",
        "/admin/user-groups",
        GroupsRoundedIcon,
        "user_group.view",
      ],
      [
        "Project Teams",
        "/admin/project-teams",
        GroupsRoundedIcon,
        "project_team.view",
      ],
      ["Reminders", "/admin/reminders", NotificationsNoneRoundedIcon],
      ["Team Chat & Meetings", "/admin/communication", GroupsRoundedIcon],
    ],
  },
  {
    title: "Administration",
    icon: SettingsRoundedIcon,
    items: [
      ["Project Status", "/admin/project-status", TuneRoundedIcon],
      ["Ticket Status", "/admin/ticket-status", TuneRoundedIcon],
      [
        "Ticket Types",
        "/admin/ticket-types",
        TuneRoundedIcon,
        "ticket_type.view",
      ],
      [
        "Custom Fields",
        "/admin/custom-fields",
        TuneRoundedIcon,
        "custom_field.view",
      ],
      [
        "Field Configuration",
        "/admin/field-configurations",
        TuneRoundedIcon,
        "field_configuration.view",
      ],
      [
        "Screen Configuration",
        "/admin/screen-configurations",
        TuneRoundedIcon,
        "screen_configuration.view",
      ],
      [
        "Workflow Configuration",
        "/admin/workflow",
        TuneRoundedIcon,
        "workflow.view",
      ],
      [
        "Issue Templates",
        "/admin/ticket-templates",
        TuneRoundedIcon,
        "ticket_template.view",
      ],
      [
        "Ticket Priorities",
        "/admin/ticket-priorities",
        TuneRoundedIcon,
        "ticket_priority.view",
      ],
      ["Security", "/admin/security", SecurityRoundedIcon],
      ["Roles", "/admin/roles", AdminPanelSettingsRoundedIcon, "role.view"],
      [
        "Permissions",
        "/admin/permissions",
        SecurityRoundedIcon,
        "permission.view",
      ],
      [
        "Project Security",
        "/admin/project-security",
        SecurityRoundedIcon,
        "permission_scheme.view",
      ],
      ["Notifications", "/admin/notifications", NotificationsNoneRoundedIcon],
    ],
  },
  {
    title: "Time",
    icon: AccessTimeRoundedIcon,
    items: [
      [
        "Timesheet Dashboard",
        "/admin/timesheet-dashboard",
        DashboardRoundedIcon,
      ],
      ["Timesheet", "/admin/timesheet", AccessTimeRoundedIcon],
      ["Timesheet Export", "/admin/timesheet-export", AccessTimeRoundedIcon],
      [
        "Member Availability",
        "/admin/member-availability",
        EventAvailableRoundedIcon,
      ],
    ],
  },
];

function Item({ item, active, onClose }) {
  const [label, path, Icon] = item;
  return (
    <ListItemButton
      component={NavLink}
      to={path}
      end={path === "/admin"}
      onClick={onClose}
      aria-current={active ? "page" : undefined}
      sx={{
        minHeight: 42,
        mb: 0.35,
        px: 1.5,
        borderRadius: 1.5,
        position: "relative",
        color: active ? PRIMARY : TEXT_SECONDARY,
        transition: `background-color ${MOTION.fast} ${MOTION.easing}, transform ${MOTION.fast} ${MOTION.easingOut}`,
        "&:hover": {
          bgcolor: active ? "rgba(99,102,241,.22)" : SIDEBAR.itemHoverBg,
          transform: "translateX(1px)",
        },
        "&.active": { bgcolor: "rgba(99,102,241,.22)", fontWeight: 700 },
        "&.active::before": {
          content: '""',
          position: "absolute",
          left: 3,
          top: 8,
          bottom: 8,
          width: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
        },
      }}
    >
      <Box
        sx={{ width: 28, display: "grid", placeItems: "center", flexShrink: 0 }}
      >
        <Icon sx={{ fontSize: 19 }} />
      </Box>
      <Typography
        noWrap
        sx={{ ml: 1, fontSize: 13.5, fontWeight: active ? 700 : 500 }}
      >
        {label}
      </Typography>
    </ListItemButton>
  );
}

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const { logout, hasPermission, isSystemAdmin, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState({});

  const visibleSections = useMemo(
    () =>
      SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter(
          (item) => isSystemAdmin() || !item[3] || hasPermission(item[3]),
        ),
      })).filter((section) => section.items.length),
    [hasPermission, isSystemAdmin],
  );

  useEffect(() => {
    const active = {};
    visibleSections.forEach((section) => {
      if (
        section.items.some(
          (item) =>
            location.pathname === item[1] ||
            location.pathname.startsWith(`${item[1]}/`),
        )
      )
        active[section.title] = true;
    });
    setOpen((prev) => ({ ...prev, ...active }));
  }, [location.pathname, visibleSections]);

  const role = isSystemAdmin()
    ? "System Administrator"
    : String(user?.role || "Administrator")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
  const content = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: SIDEBAR.background,
      }}
    >
      <Box
        sx={{
          height: 72,
          px: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.25,
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
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            noWrap
            sx={{ fontSize: 15, fontWeight: 800, color: "#FFFFFF" }}
          >
            Project Management
          </Typography>
          <Typography noWrap sx={{ fontSize: 11, color: "#94A3B8" }}>
            {role}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          aria-label="Close navigation"
          sx={{ display: { xs: "flex", md: "none" } }}
        >
          <MenuOpenRoundedIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box
        component="nav"
        aria-label="Admin navigation"
        sx={{ flex: 1, overflowY: "auto", px: 1, py: 1.25 }}
      >
        {visibleSections.map((section) => {
          const active = section.items.some(
            (item) =>
              location.pathname === item[1] ||
              location.pathname.startsWith(`${item[1]}/`),
          );
          const expanded =
            open[section.title] ?? (active || section.title === "Work");
          const SectionIcon = section.icon;
          return (
            <Box key={section.title} sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() =>
                  setOpen((p) => ({ ...p, [section.title]: !expanded }))
                }
                aria-expanded={expanded}
                sx={{
                  minHeight: 38,
                  px: 1.25,
                  borderRadius: 1.5,
                  color: active ? PRIMARY : TEXT_SECONDARY,
                  "&:hover": { bgcolor: "rgba(255,255,255,.06)" },
                }}
              >
                <Box sx={{ width: 28, display: "grid", placeItems: "center" }}>
                  <SectionIcon sx={{ fontSize: 18 }} />
                </Box>
                <Typography
                  sx={{
                    ml: 1,
                    flex: 1,
                    fontSize: 11.5,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                  }}
                >
                  {section.title}
                </Typography>
                <ExpandMoreRoundedIcon
                  sx={{
                    fontSize: 18,
                    transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
                    transition: `transform ${MOTION.fast} ${MOTION.easing}`,
                  }}
                />
              </ListItemButton>
              <Collapse in={expanded} timeout={180}>
                <List disablePadding sx={{ mt: 0.25 }}>
                  {section.items.map((item) => (
                    <Item
                      key={item[1]}
                      item={item}
                      active={
                        location.pathname === item[1] ||
                        location.pathname.startsWith(`${item[1]}/`)
                      }
                      onClose={onClose}
                    />
                  ))}
                </List>
              </Collapse>
            </Box>
          );
        })}
      </Box>
      <Divider sx={{ borderColor: SIDEBAR.border }} />
      <Box sx={{ p: 1 }}>
        <ListItemButton
          onClick={() => {
            onClose();
            logout();
          }}
          sx={{
            minHeight: 42,
            borderRadius: 1.5,
            color: PRIORITY_COLORS.HIGHEST,
            "&:hover": { bgcolor: "rgba(239,68,68,.10)" },
          }}
        >
          <Box sx={{ width: 28, display: "grid", placeItems: "center" }}>
            <LogoutRoundedIcon fontSize="small" />
          </Box>
          <Typography sx={{ ml: 1, fontSize: 13.5, fontWeight: 650 }}>
            Sign out
          </Typography>
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            border: 0,
            borderRight: `1px solid ${BORDER}`,
            boxShadow: "8px 0 30px rgba(16,24,40,.025)",
            boxSizing: "border-box",
          },
        }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: Math.min(DRAWER_WIDTH, 320),
            border: 0,
            boxSizing: "border-box",
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}
