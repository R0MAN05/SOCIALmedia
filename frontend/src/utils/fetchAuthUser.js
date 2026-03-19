export const fetchAuthUser = async () => {
  const res = await fetch("/api/auth/me");
  const data = await res.json();

  if (data?.error) return null;
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch auth user");
  }

  return data;
};
