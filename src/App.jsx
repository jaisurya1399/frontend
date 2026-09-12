import { Box, CircularProgress } from "@mui/material";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import WorkspaceLayout from "./layouts/WorkspaceLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// ============================================================
// AUTH
// ============================================================
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));
const MfaVerify = lazy(() => import("./pages/auth/MfaVerify"));

// ============================================================
// ADMIN - MANAGEMENT
// ============================================================
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const DashboardAnalytics = lazy(
  () => import("./pages/admin/DashboardAnalytics"),
);
const EnterpriseReports = lazy(() => import("./pages/admin/EnterpriseReports"));
const EnterpriseManagement = lazy(
  () => import("./pages/admin/EnterpriseManagement"),
);
const Projects = lazy(() => import("./pages/admin/Projects"));
const ProjectCreate = lazy(() => import("./pages/projects/ProjectCreate"));
const ProjectDetails = lazy(() => import("./pages/projects/ProjectDetails"));
const ProjectEdit = lazy(() => import("./pages/projects/ProjectEdit"));
const ProjectSettings = lazy(() => import("./pages/projects/ProjectSettings"));
const ProjectAudit = lazy(() => import("./pages/projects/ProjectAudit"));
const Epics = lazy(() => import("./pages/admin/Epics"));
const Tickets = lazy(() => import("./pages/admin/Tickets"));
const Backlog = lazy(() => import("./pages/admin/Backlog"));
const Board = lazy(() => import("./pages/admin/Board"));
const Roadmap = lazy(() => import("./pages/admin/Roadmap"));
const Milestones = lazy(() => import("./pages/admin/Milestones"));
const Releases = lazy(() => import("./pages/admin/Releases"));
const DailyScrum = lazy(() => import("./pages/admin/DailyScrum"));
const MemberAvailability = lazy(
  () => import("./pages/workspace/MemberAvailability"),
);
const ScrumDashboard = lazy(() => import("./pages/admin/ScrumDashboard"));
const TicketDetails = lazy(() => import("./pages/workspace/TicketDetails"));

// ============================================================
// ADMIN - REFERENTIAL
// ============================================================
const Activities = lazy(() => import("./pages/admin/Activities"));
const ProjectStatus = lazy(() => import("./pages/admin/ProjectStatus"));
const TicketStatus = lazy(() => import("./pages/admin/TicketStatus"));
const TicketTypes = lazy(() => import("./pages/admin/TicketTypes"));
const CustomFields = lazy(() => import("./pages/admin/CustomFields"));
const FieldConfigurations = lazy(
  () => import("./pages/admin/FieldConfigurations"),
);
const ScreenConfigurations = lazy(
  () => import("./pages/admin/ScreenConfigurations"),
);
const WorkflowConfiguration = lazy(
  () => import("./pages/admin/WorkflowConfiguration"),
);
const TicketTemplates = lazy(() => import("./pages/admin/TicketTemplates"));
const ProjectTeams = lazy(() => import("./pages/admin/ProjectTeams"));
const ProjectSecuritySchemes = lazy(
  () => import("./pages/admin/ProjectSecuritySchemes"),
);
const TicketPriorities = lazy(() => import("./pages/admin/TicketPriorities"));

// ============================================================
// ADMIN - GENERAL
// ============================================================
const Users = lazy(() => import("./pages/admin/Users"));
const UserGroups = lazy(() => import("./pages/admin/UserGroups"));
const Permissions = lazy(() => import("./pages/admin/Permissions"));
const Roles = lazy(() => import("./pages/admin/Roles"));
const SecuritySettings = lazy(() => import("./pages/admin/SecuritySettings"));
const AiPmAssistant = lazy(() => import("./pages/workspace/AiPmAssistant"));
const Reminders = lazy(() => import("./pages/workspace/Reminders"));

// ============================================================
// ADMIN - TIMESHEET
// ============================================================
const TimesheetDashboard = lazy(
  () => import("./pages/admin/TimesheetDashboard"),
);
const TimesheetExport = lazy(() => import("./pages/admin/TimesheetExport"));
const Timesheet = lazy(() => import("./pages/admin/Timesheet"));
const TimeTrackingReports = lazy(
  () => import("./pages/admin/TimeTrackingReports"),
);

// ============================================================
// NOTIFICATIONS
// ============================================================
const Notifications = lazy(() => import("./pages/notifications/Notifications"));
const CommunicationHub = lazy(() => import("./pages/chat/CommunicationHub"));

// ============================================================
// TEAM MEMBER / DEVELOPER
// ============================================================
const DeveloperDashboard = lazy(() => import("./pages/workspace/Dashboard"));
const MyProjects = lazy(() => import("./pages/workspace/MyProjects"));
const DeveloperMyTasks = lazy(() => import("./pages/workspace/MyTasks"));
const DeveloperBoard = lazy(() => import("./pages/workspace/DeveloperBoard"));
const DeveloperDailyScrum = lazy(
  () => import("./pages/workspace/DeveloperDailyScrum"),
);
const DeveloperTimesheet = lazy(
  () => import("./pages/workspace/DeveloperTimesheet"),
);
const DeveloperProfile = lazy(
  () => import("./pages/workspace/DeveloperProfile"),
);

// ============================================================
// ROUTE-LEVEL LOADING FALLBACK
// ============================================================
// Each page above is code-split into its own chunk (React.lazy), so the
// browser only downloads the ~50-90KB a route actually needs instead of a
// single 1.2MB+ bundle covering every admin/developer screen up front.
// This fallback is what's visible for the brief moment a chunk is fetched.
function RouteFallback() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        width: "100%",
      }}
    >
      <CircularProgress size={28} thickness={4} />
    </Box>
  );
}

// ============================================================
// APP
// ============================================================

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* ========================================================
          PUBLIC ROUTES
      ======================================================== */}

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/mfa-verify" element={<MfaVerify />} />

        {/* ========================================================
          ALL PROTECTED ROUTES
      ======================================================== */}

        <Route element={<ProtectedRoute />}>
          {/* ======================================================
            ADMIN
        ====================================================== */}

          <Route
            path="/admin"
            element={<ProtectedRoute allowedRoles={["ADMIN"]} />}
          >
            <Route element={<AdminLayout />}>
              {/* Dashboard */}

              <Route index element={<Dashboard />} />

              <Route
                path="dashboard-analytics"
                element={<DashboardAnalytics />}
              />
              <Route
                path="enterprise-reports"
                element={<EnterpriseReports />}
              />
              <Route
                path="enterprise-management"
                element={<EnterpriseManagement />}
              />

              {/* ==================================================
                MANAGEMENT
            ================================================== */}

              <Route path="projects" element={<Projects />} />
              <Route
                path="projects/create"
                element={
                  <ProtectedRoute allowedPermissions={["project.view"]} />
                }
              >
                <Route index element={<ProjectCreate />} />
              </Route>
              <Route
                path="projects/:id"
                element={
                  <ProtectedRoute allowedPermissions={["project.view"]} />
                }
              >
                <Route index element={<ProjectDetails />} />
              </Route>
              <Route path="projects/:id/edit" element={<ProjectEdit />} />
              <Route
                path="projects/:id/settings"
                element={<ProjectSettings />}
              />
              <Route path="projects/:id/audit" element={<ProjectAudit />} />

              <Route path="epics" element={<Epics />} />

              <Route path="tickets" element={<Tickets />} />

              <Route path="backlog" element={<Backlog />} />

              <Route path="board" element={<Board />} />

              <Route path="roadmap" element={<Roadmap />} />
              <Route path="milestones" element={<Milestones />} />
              <Route path="releases" element={<Releases />} />

              <Route path="daily-scrum" element={<DailyScrum />} />
              <Route
                path="member-availability"
                element={<MemberAvailability />}
              />
              <Route path="scrum-dashboard" element={<ScrumDashboard />} />

              {/* ==================================================
                REFERENTIAL
            ================================================== */}

              <Route path="activities" element={<Activities />} />

              <Route path="project-status" element={<ProjectStatus />} />

              <Route path="ticket-status" element={<TicketStatus />} />

              <Route path="ticket-types" element={<TicketTypes />} />
              <Route path="custom-fields" element={<CustomFields />} />
              <Route
                path="field-configurations"
                element={<FieldConfigurations />}
              />
              <Route
                path="screen-configurations"
                element={<ScreenConfigurations />}
              />
              <Route path="workflow" element={<WorkflowConfiguration />} />
              <Route path="ticket-templates" element={<TicketTemplates />} />
              <Route path="project-teams" element={<ProjectTeams />} />
              <Route
                path="project-security"
                element={<ProjectSecuritySchemes />}
              />

              <Route path="ticket-priorities" element={<TicketPriorities />} />

              {/* ==================================================
                GENERAL
            ================================================== */}

              <Route
                path="users"
                element={<ProtectedRoute allowedPermissions={["user.view"]} />}
              >
                <Route index element={<Users />} />
              </Route>

              <Route path="user-groups" element={<UserGroups />} />

              <Route
                path="permissions"
                element={
                  <ProtectedRoute allowedPermissions={["permission.view"]} />
                }
              >
                <Route index element={<Permissions />} />
              </Route>

              <Route
                path="roles"
                element={<ProtectedRoute allowedPermissions={["role.view"]} />}
              >
                <Route index element={<Roles />} />
              </Route>

              <Route path="tickets/:id" element={<TicketDetails />} />

              {/* ==================================================
                TIMESHEET
            ================================================== */}

              <Route
                path="timesheet-dashboard"
                element={<TimesheetDashboard />}
              />

              <Route path="timesheet-export" element={<TimesheetExport />} />

              <Route path="timesheet" element={<Timesheet />} />

              <Route path="time-tracking" element={<TimeTrackingReports />} />

              {/* ==================================================
                NOTIFICATIONS
            ================================================== */}

              <Route path="notifications" element={<Notifications />} />
              <Route path="communication" element={<CommunicationHub />} />

              <Route path="ai-pm" element={<AiPmAssistant />} />
              <Route path="reminders" element={<Reminders />} />
              <Route path="security" element={<SecuritySettings />} />
            </Route>
          </Route>

          {/* ======================================================
            TEAM MEMBER / DEVELOPER
        ====================================================== */}

          <Route path="/developer" element={<ProtectedRoute />}>
            <Route element={<WorkspaceLayout />}>
              {/* Developer Dashboard */}

              <Route index element={<DeveloperDashboard />} />

              {/* My Projects */}

              <Route
                path="projects"
                element={
                  <ProtectedRoute allowedPermissions={["project.view"]} />
                }
              >
                <Route index element={<MyProjects />} />
              </Route>
              <Route
                path="projects/create"
                element={
                  <ProtectedRoute allowedPermissions={["project.view"]} />
                }
              >
                <Route index element={<ProjectCreate />} />
              </Route>
              <Route
                path="projects/:id"
                element={
                  <ProtectedRoute allowedPermissions={["project.view"]} />
                }
              >
                <Route index element={<ProjectDetails />} />
              </Route>
              <Route
                path="projects/:id/edit"
                element={
                  <ProtectedRoute allowedPermissions={["project.view"]} />
                }
              >
                <Route index element={<ProjectEdit />} />
              </Route>
              <Route
                path="projects/:id/settings"
                element={
                  <ProtectedRoute allowedPermissions={["project.view"]} />
                }
              >
                <Route index element={<ProjectSettings />} />
              </Route>
              <Route
                path="projects/:id/audit"
                element={
                  <ProtectedRoute allowedPermissions={["project.view"]} />
                }
              >
                <Route index element={<ProjectAudit />} />
              </Route>

              {/* My Tasks */}

              <Route
                path="tasks"
                element={
                  <ProtectedRoute allowedPermissions={["ticket.view"]} />
                }
              >
                <Route index element={<DeveloperMyTasks />} />
              </Route>

              {/* Ticket Details */}

              <Route path="tickets/:id" element={<TicketDetails />} />

              {/* Board */}

              <Route
                path="board"
                element={
                  <ProtectedRoute allowedPermissions={["ticket.view"]} />
                }
              >
                <Route index element={<DeveloperBoard />} />
              </Route>

              {/* Daily Scrum */}

              <Route path="daily-scrum" element={<DeveloperDailyScrum />} />

              <Route path="availability" element={<MemberAvailability />} />

              {/* Timesheet */}

              <Route path="timesheet" element={<DeveloperTimesheet />} />

              <Route path="time-tracking" element={<TimeTrackingReports />} />

              {/* Profile */}

              <Route path="profile" element={<DeveloperProfile />} />

              <Route path="ai-pm" element={<AiPmAssistant />} />
              <Route path="reminders" element={<Reminders />} />

              {/* Notifications */}

              <Route path="notifications" element={<Notifications />} />
              <Route path="communication" element={<CommunicationHub />} />

              <Route path="security" element={<SecuritySettings />} />
            </Route>
          </Route>
        </Route>

        {/* ========================================================
          FALLBACK
      ======================================================== */}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
