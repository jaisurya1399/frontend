import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import { Component } from "react";

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          p: 3,
          bgcolor: "#F6F7FB",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 560,
            p: 4,
            border: "1px solid #E2E8F0",
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" fontWeight={800} gutterBottom>
            This page could not be loaded
          </Typography>
          <Alert severity="error" sx={{ mb: 2 }}>
            A UI component failed while rendering. Your session is still intact.
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Open the browser console for the exact error, then reload the page.
          </Typography>
          <Button variant="contained" onClick={this.handleReload}>
            Reload page
          </Button>
        </Paper>
      </Box>
    );
  }
}
