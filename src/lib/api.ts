const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
) {
  // 1. Fetch fresh JWT from Next.js session bridge
  const tokenRes = await fetch("/api/token", { cache: "no-store" });
  if (!tokenRes.ok) {
    throw new Error("Authentication required. Please sign in again.");
  }
  const { token } = await tokenRes.json();

  // 2. Call Express backend with Bearer token
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
