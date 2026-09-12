import { ACCESS_TOKEN_KEY } from "./axios";
import appConfig from "../config/appConfig";

const API_BASE_URL = appConfig.apiBaseUrl;

const createSource = (path, { onMessage, onError } = {}) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const url = new URL(`${API_BASE_URL}${path}`);
  if (token) {
    url.searchParams.set("access_token", token);
  }

  const source = new EventSource(url.toString());

  if (onMessage) {
    source.onmessage = (event) => {
      try {
        onMessage(JSON.parse(event.data), event);
      } catch {
        onMessage(event.data, event);
      }
    };
  }

  if (onError) {
    source.onerror = onError;
  }

  return source;
};

export const subscribeProjectRealtime = (projectId, handlers) =>
  createSource(`/realtime/projects/${projectId}`, handlers);

export const subscribeNotificationRealtime = ({
  onNotification,
  onConnected,
  onError,
} = {}) => {
  const source = createSource("/realtime/notifications", { onError });

  // Backend sends named SSE events (event: notification), so onmessage
  // alone will NOT receive them. Listen explicitly for the notification event.
  source.addEventListener("notification", (event) => {
    try {
      const data = JSON.parse(event.data);
      onNotification?.(data, event);
    } catch {
      onNotification?.({ message: event.data }, event);
    }
  });

  source.addEventListener("connected", (event) => {
    try {
      onConnected?.(JSON.parse(event.data), event);
    } catch {
      onConnected?.(event.data, event);
    }
  });

  return source;
};
