import axios from 'axios';
import { setAccessToken, setLoginStatus, handleLogout, getAccessToken } from "../services/TokenUtils";
import Store from "../states/Store";
import { showModal } from "../states/slices/ModalSlicer";

const SPRING_API = "http://localhost:8080";

// Create an Axios instance
const api = axios.create({
  baseURL: `${SPRING_API}/api/v1`, // Update this with your backend URL
  withCredentials: true, // Allows sending cookies with requests
});

// Request interceptor to add access token to headers
api.interceptors.request.use(
  (config) => {
    // Check if we are on the login page
    if (config.url === '/' || config.url === '/login-user') {
      // Do not attach the token or trigger refresh logic for login requests
      return config;
    }

    const accessToken = getAccessToken(); // Retrieve the access token from local storage
    if (accessToken) {
      config.headers.Authorization = `${accessToken}`; // Attach the access token to the headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const errorHandler = (error) => {
  if (error?.code === "ERR_NETWORK") {
    Store.dispatch(showModal({
      message: "Network Timeout",
      type: "Error"
    }));
  } else if (error.response?.status === 400) {
    Store.dispatch(showModal({
      message: "Please Make Sure to fill all the Blanks",
      type: "Error"
    }));
  } else if (error.response?.status === 401) {
    Store.dispatch(showModal({
      message: error.response?.data?.message,
      type: "Error"
    }));
  } else if (error.response?.status === 409) {
    Store.dispatch(showModal({
      message: error.response?.data?.message,
      type: "Error"
    }));
  } else if (error.response?.data?.message) {
    Store.dispatch(showModal({
      message: error.response?.data?.message,
      type: "Error"
    }));
  } else {
    Store.dispatch(showModal({
      message: "An unexpected error occurred",
      type: "Error"
    }));
  }
}

// Response interceptor to handle 401 errors and refresh the access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Avoid refreshing tokens on unauthenticated routes like login
    if (originalRequest.url === '/auth/authenticate') {
      errorHandler(error);
      return Promise.reject(error);
    }

    if (error.code === "ERR_NETWORK") {
      errorHandler(error);
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the access token
        const response = await axios.post(
          `${SPRING_API}/api/v1/auth/refresh-token`, // Endpoint to refresh the token
          {},
          { withCredentials: true } // Send the refresh token stored in HttpOnly cookie
        );
        const newAccessToken = response.data.data;
        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `${newAccessToken}`; // Attach the new token to the original request
        return api(originalRequest); // Retry the original request with the new token
      } catch (refreshError) {
        if (refreshError.response?.status === 401) {
          Store.dispatch(showModal({
            message: error.response?.data?.message,
            type: "Error"
          }));
          handleLogout();
        }
        errorHandler(refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;