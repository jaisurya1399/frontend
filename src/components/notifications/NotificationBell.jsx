import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
  Badge,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import { subscribeNotificationRealtime } from "../../api/realtimeApi";
import notificationService from "../../services/notificationService";

const NotificationBell = ({
  userId,
  notifiableType = "User",
  onNotificationClick,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);

  const loadNotifications = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const [notificationData, countData] = await Promise.all([
        notificationService.getUserNotifications(notifiableType, userId),
        notificationService.getUnreadCount(notifiableType, userId),
      ]);

      setNotifications(notificationData.slice(0, 5));
      setUnreadCount(Number(countData) || 0);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return undefined;

    loadNotifications();

    const source = subscribeNotificationRealtime({
      onNotification: (incoming) => {
        if (!incoming?.id) return;

        setNotifications((prev) => {
          if (prev.some((item) => String(item.id) === String(incoming.id))) {
            return prev;
          }

          const notification = {
            id: incoming.id,
            type: incoming.type,
            notifiableType: "USER",
            notifiableId: userId,
            data: JSON.stringify({
              ticketId: incoming.ticketId,
              ticketCode: incoming.ticketCode,
              message: incoming.message,
            }),
            readAt: null,
            createdAt: new Date().toISOString(),
          };

          return [notification, ...prev].slice(0, 5);
        });

        setUnreadCount((prev) => prev + 1);

        // Reconcile with the database shortly after the realtime event.
        window.setTimeout(() => loadNotifications(), 300);
      },
      onError: (error) => {
        // EventSource automatically reconnects. Do not repeatedly refetch
        // here because it can create a request loop while the API is down.
        console.warn("Notification realtime connection interrupted", error);
      },
    });

    // Poll as a reliable fallback for browsers/proxies that do not keep SSE
    // connections open. This also guarantees the bell updates even if the
    // realtime stream is temporarily unavailable.
    const poll = window.setInterval(() => {
      loadNotifications();
    }, 5000);

    return () => {
      source.close();
      window.clearInterval(poll);
    };
  }, [userId, notifiableType]);

  const handleOpen = async (event) => {
    setAnchorEl(event.currentTarget);
    await loadNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.readAt) {
        await notificationService.markAsRead(notification.id);

        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  readAt: new Date().toISOString(),
                }
              : item,
          ),
        );

        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }

      handleClose();

      if (onNotificationClick) {
        onNotificationClick(notification);
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const parseData = (data) => {
    try {
      return JSON.parse(data);
    } catch {
      return {
        message: data,
      };
    }
  };

  const getMessage = (notification) => {
    const data = parseData(notification.data);

    return data.message || data.title || data.description || notification.type;
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleOpen}
        aria-label="notifications"
      >
        <Badge badgeContent={unreadCount} color="error" max={99}>
          {unreadCount > 0 ? <NotificationsIcon /> : <NotificationsNoneIcon />}
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 520,
            mt: 1,
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontWeight={700}>Notifications</Typography>

          {unreadCount > 0 && (
            <Typography variant="caption" color="primary">
              {unreadCount} unread
            </Typography>
          )}
        </Box>

        <Divider />

        {loading ? (
          <Box
            sx={{
              py: 5,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={25} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <NotificationsNoneIcon
              sx={{
                fontSize: 45,
                color: "text.secondary",
              }}
            />

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              No notifications
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {notifications.map((notification) => (
              <ListItemButton
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  alignItems: "flex-start",
                  backgroundColor: notification.readAt
                    ? "transparent"
                    : "action.hover",
                  borderLeft: notification.readAt
                    ? "3px solid transparent"
                    : "3px solid",
                  borderColor: notification.readAt
                    ? "transparent"
                    : "primary.main",
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      fontWeight={notification.readAt ? 400 : 700}
                    >
                      {getMessage(notification)}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          display: "block",
                          textTransform: "capitalize",
                        }}
                      >
                        {notification.type}
                      </Typography>

                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        {formatDate(notification.createdAt)}
                      </Typography>
                    </>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        )}

        <Divider />

        <MenuItem
          onClick={() => {
            handleClose();
            if (onNotificationClick) {
              onNotificationClick(null);
            }
          }}
          sx={{
            justifyContent: "center",
            fontWeight: 600,
          }}
        >
          View all notifications
        </MenuItem>
      </Menu>
    </>
  );
};

export default NotificationBell;
