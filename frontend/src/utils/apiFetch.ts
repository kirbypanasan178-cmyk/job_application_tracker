const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Something went wrong");
  }

  // For endpoints that return 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};