import { Navigate, Route, Routes } from "react-router-dom";

// ============================================================
// AUTH
// ============================================================

import SecuritySettings from "./pages/admin/SecuritySettings";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import MfaVerify from "./pages/auth/MfaVerify";
import ResetPassword from "./pages/auth/ResetPassword";
import Signup from "./pages/auth/Signup";
import VerifyEmail from "./pages/auth/VerifyEmail";

// ============================================================
// ROUTE PROTECTION
// ============================================================

import ProtectedRoute from "./routes/ProtectedRoute";

// ============================================================
// LAYOUTS
// ============================================================

import AdminLayout from "./layouts/AdminLayout";
import WorkspaceLayout from "./layouts/WorkspaceLayout";

// ============================================================
// NOTIFICATIONS
// ============================================================

import CommunicationHub from "./pages/chat/CommunicationHub";
import Notifications from "./pages/notifications/Notifications";

// ============================================================
// ADMIN - MANAGEMENT
// ============================================================

import Backlog from "./pages/admin/Backlog";
import Board from "./pages/admin/Board";
import DailyScrum from "./pages/admin/DailyScrum";
import Dashboard from "./pages/admin/Dashboard";
import DashboardAnalytics from "./pages/admin/DashboardAnalytics";
import EnterpriseManagement from "./pages/admin/EnterpriseManagement";
import EnterpriseReports from "./pages/admin/EnterpriseReports";
import Epics from "./pages/admin/Epics";
import Milestones from "./pages/admin/Milestones";
import Projects from "./pages/admin/Projects";
import Releases from "./pages/admin/Releases";
import Roadmap from "./pages/admin/Roadmap";
import ScrumDashboard from "./pages/admin/ScrumDashboard";
import Tickets from "./pages/admin/Tickets";

// ============================================================
// ADMIN - REFERENTIAL
// ============================================================

import Activities from "./pages/admin/Activities";
import CustomFields from "./pages/admin/CustomFields";
import FieldConfigurations from "./pages/admin/FieldConfigurations";
import ProjectSecuritySchemes from "./pages/admin/ProjectSecuritySchemes";
import ProjectStatus from "./pages/admin/ProjectStatus";
import ProjectTeams from "./pages/admin/ProjectTeams";
import ScreenConfigurations from "./pages/admin/ScreenConfigurations";
import TicketPriorities from "./pages/admin/TicketPriorities";
import TicketStatus from "./pages/admin/TicketStatus";
import TicketTemplates from "./pages/admin/TicketTemplates";
import TicketTypes from "./pages/admin/TicketTypes";
import WorkflowConfiguration from "./pages/admin/WorkflowConfiguration";

// ============================================================
// ADMIN - GENERAL
// ============================================================

import Permissions from "./pages/admin/Permissions";
import Roles from "./pages/admin/Roles";
import UserGroups from "./pages/admin/UserGroups";
import Users from "./pages/admin/Users";

// ============================================================
// ADMIN - TIMESHEET
// ============================================================

import Timesheet from "./pages/admin/Timesheet";
import TimesheetDashboard from "./pages/admin/TimesheetDashboard";
import TimesheetExport from "./pages/admin/TimesheetExport";
import TimeTrackingReports from "./pages/admin/TimeTrackingReports";

// ============================================================
// TEAM MEMBER / DEVELOPER
// ============================================================

import ProjectAudit from "./pages/projects/ProjectAudit";
import ProjectCreate from "./pages/projects/ProjectCreate";
import ProjectDetails from "./pages/projects/ProjectDetails";
import ProjectEdit from "./pages/projects/ProjectEdit";
import ProjectSettings from "./pages/projects/ProjectSettings";
import AiPmAssistant from "./pages/workspace/AiPmAssistant";
import DeveloperDashboard from "./pages/workspace/Dashboard";
import DeveloperBoard from "./pages/workspace/DeveloperBoard";
import DeveloperDailyScrum from "./pages/workspace/DeveloperDailyScrum";
import DeveloperProfile from "./pages/workspace/DeveloperProfile";
import DeveloperTimesheet from "./pages/workspace/DeveloperTimesheet";
import MemberAvailability from "./pages/workspace/MemberAvailability";
import MyProjects from "./pages/workspace/MyProjects";
import DeveloperMyTasks from "./pages/workspace/MyTasks";
import Reminders from "./pages/workspace/Reminders";
import TicketDetails from "./pages/workspace/TicketDetails";

// ============================================================
// APP
// ============================================================

export default function App() {
  return (
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
            <Route path="enterprise-reports" element={<EnterpriseReports />} />
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
              element={<ProtectedRoute allowedPermissions={["project.view"]} />}
            >
              <Route index element={<ProjectCreate />} />
            </Route>
            <Route
              path="projects/:id"
              element={<ProtectedRoute allowedPermissions={["project.view"]} />}
            >
              <Route index element={<ProjectDetails />} />
            </Route>
            <Route path="projects/:id/edit" element={<ProjectEdit />} />
            <Route path="projects/:id/settings" element={<ProjectSettings />} />
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
              element={<ProtectedRoute allowedPermissions={["project.view"]} />}
            >
              <Route index element={<MyProjects />} />
            </Route>
            <Route
              path="projects/create"
              element={<ProtectedRoute allowedPermissions={["project.view"]} />}
            >
              <Route index element={<ProjectCreate />} />
            </Route>
            <Route
              path="projects/:id"
              element={<ProtectedRoute allowedPermissions={["project.view"]} />}
            >
              <Route index element={<ProjectDetails />} />
            </Route>
            <Route
              path="projects/:id/edit"
              element={<ProtectedRoute allowedPermissions={["project.view"]} />}
            >
              <Route index element={<ProjectEdit />} />
            </Route>
            <Route
              path="projects/:id/settings"
              element={<ProtectedRoute allowedPermissions={["project.view"]} />}
            >
              <Route index element={<ProjectSettings />} />
            </Route>
            <Route
              path="projects/:id/audit"
              element={<ProtectedRoute allowedPermissions={["project.view"]} />}
            >
              <Route index element={<ProjectAudit />} />
            </Route>

            {/* My Tasks */}

            <Route
              path="tasks"
              element={<ProtectedRoute allowedPermissions={["ticket.view"]} />}
            >
              <Route index element={<DeveloperMyTasks />} />
            </Route>

            {/* Ticket Details */}

            <Route path="tickets/:id" element={<TicketDetails />} />

            {/* Board */}

            <Route
              path="board"
              element={<ProtectedRoute allowedPermissions={["ticket.view"]} />}
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
  );
}
