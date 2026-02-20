/**
 * API Service - Axios-like fetch wrapper with JWT
 * In dev, call backend directly to avoid proxy issues
 */
const BASE = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "/api";

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
