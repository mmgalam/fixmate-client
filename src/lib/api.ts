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

  const tokenData = (await tokenRes.json().catch(() => ({}))) as {
    token?: string;
  };
  if (!tokenData.token) {
    throw new Error("Invalid session token. Please sign in again.");
  }

  // 2. Call Express backend with Bearer token
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenData.token}`,
      ...options.headers,
    },
  });

  const data = (await res.json().catch(() => ({}))) as {
    message?: string;
    [key: string]: unknown;
  };

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}
