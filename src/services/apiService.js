import api from "../api/axios";

/**
 * Normalize API errors into one consistent format.
 */
export const normalizeApiError = (error) => {
  if (!error) {
    return {
      message: "An unknown error occurred.",
      status: null,
      data: null,
      originalError: null,
    };
  }

  const response = error.response;

  let message = "Something went wrong.";

  if (response?.data) {
    if (typeof response.data === "string") {
      message = response.data;
    } else {
      message =
        response.data.message ||
        response.data.error ||
        response.data.detail ||
        message;
    }
  } else if (error.message) {
    message = error.message;
  }

  return {
    message,
    status: response?.status ?? null,
    data: response?.data ?? null,
    originalError: error,
  };
};

/**
 * GET request
 */
export const get = async (url, config = {}) => {
  try {
    const response = await api.get(url, config);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

/**
 * POST request
 */
export const post = async (url, data = {}, config = {}) => {
  try {
    const response = await api.post(url, data, config);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

/**
 * PUT request
 */
export const put = async (url, data = {}, config = {}) => {
  try {
    const response = await api.put(url, data, config);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

/**
 * PATCH request
 */
export const patch = async (url, data = {}, config = {}) => {
  try {
    const response = await api.patch(url, data, config);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

/**
 * DELETE request
 */
export const remove = async (url, config = {}) => {
  try {
    const response = await api.delete(url, config);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

/**
 * File upload
 */
export const upload = async (url, formData, config = {}) => {
  try {
    const response = await api.post(url, formData, {
      ...config,
      headers: {
        ...(config.headers || {}),
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

const apiService = {
  get,
  post,
  put,
  patch,
  delete: remove,
  upload,
  normalizeApiError,
};

export default apiService;
