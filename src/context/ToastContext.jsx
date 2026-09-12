import { Alert, Snackbar } from "@mui/material";
import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showToast = useCallback((message, severity = "info") => {
    setToast({
      open: true,
      message,
      severity,
    });
  }, []);

  const success = useCallback(
    (message) => {
      showToast(message, "success");
    },
    [showToast],
  );

  const error = useCallback(
    (message) => {
      showToast(message, "error");
    },
    [showToast],
  );

  const warning = useCallback(
    (message) => {
      showToast(message, "warning");
    },
    [showToast],
  );

  const info = useCallback(
    (message) => {
      showToast(message, "info");
    },
    [showToast],
  );

  const closeToast = useCallback(() => {
    setToast((previous) => ({
      ...previous,
      open: false,
    }));
  }, []);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={closeToast}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          elevation={6}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};

export default ToastContext;
