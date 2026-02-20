/**
 * API Service - Axios-like fetch wrapper with JWT
 * Set VITE_API_URL in Vercel (e.g. https://kodnestbankapp.onrender.com)
 * Trailing /api is added automatically if missing
 */
function getBaseUrl() {
  if (import.meta.env.DEV) return "http://localhost:5000/api";
  const url = import.meta.env.VITE_API_URL || "";
  if (!url) return "/api";
  return url.endsWith("/api") ? url : url.replace(/\/?$/, "") + "/api";
}
const BASE = getBaseUrl();

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

const api = {
  get: (path) =>
    fetch(BASE + path, { headers: getAuthHeaders() }).then(handleResponse),
  post: (path, body) =>
    fetch(BASE + path, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),
  put: (path, body) =>
    fetch(BASE + path, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(body || {}),
    }).then(handleResponse),
};

export default api;
