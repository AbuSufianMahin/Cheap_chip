import axios from "axios";

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ───────────────────────────────────────────────────
axiosSecure.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor ──────────────────────────────────────────────────
axiosSecure.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      error.message = "Session expired. Please log in again.";
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login"; // hard redirect, no useRouter needed
      }
    } else if (status === 403) {
      error.message = "You are not authorized to perform this action.";
      if (typeof window !== "undefined") {
        window.location.href = "/error/forbidden";
      }
    } else {
      error.message = error.response?.data?.message || "Something went wrong!";
    }

    return Promise.reject(error);
  },
);

export default axiosSecure;
