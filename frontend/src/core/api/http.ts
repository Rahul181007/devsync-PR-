import axios from "axios";
const AUTH_EXCLUDED_ROUTES = [
  "/auth/login",
  "/auth/superadmin/login",
  "/auth/refresh",
  "/auth/me"
];
/**
 * AUTH_EXCLUDED_ROUTES
 * -------------------
 * These routes should NEVER trigger the token refresh logic.
 *
 * Why?
 * - Login failures are NOT caused by expired tokens
 * - Refresh endpoint must NOT try to refresh itself
 * - /auth/me is only used to check login state on page reload
 *
 * If we allow refresh logic for these routes:
 * - Infinite refresh loops can happen
 * - Users may get stuck on login
 * - App may silently fail on reload
 *
 * Rule:
 *  Only normal (business) API calls are allowed to auto-refresh tokens.
 *  Auth-related routes must fail immediately.
 */




export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(true);
  });
  failedQueue = [];
};

http.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    const isAuthRoute = AUTH_EXCLUDED_ROUTES.some(route =>
      originalRequest.url?.includes(route)
    );

    if (isAuthRoute) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => http(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await http.post("/auth/refresh");
        processQueue(null);
        return http(originalRequest);
      } catch (err) {
        processQueue(err);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

