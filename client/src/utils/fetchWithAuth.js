import API_BASE_URL from "../api";
export default async function fetchWithAuth(path, { token, method="GET", body } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return res;
}
