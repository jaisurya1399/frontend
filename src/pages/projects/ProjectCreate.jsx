import { Box, Breadcrumbs, Link, Typography } from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";

import ProjectForm from "../../components/projects/ProjectForm";

import { createProject } from "../../api/projectApi";

export default function ProjectCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const shellBase = location.pathname.startsWith("/admin")
    ? "/admin"
    : "/developer";

  const handleSubmit = async (data) => {
    try {
      const project = await createProject(data);

      navigate(`${shellBase}/projects/${project.id}`);
    } catch (error) {
      throw error;
    }
  };

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          underline="hover"
          onClick={() => navigate(`${shellBase}/projects`)}
        >
          Projects
        </Link>

        <Typography>Create</Typography>
      </Breadcrumbs>

      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Create Project
      </Typography>

      <ProjectForm onSubmit={handleSubmit} />
    </Box>
  );
}
