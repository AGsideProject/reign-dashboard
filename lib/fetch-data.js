const fetchGlobal = async (endpoint, options = {}, resp = false) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  let accessToken = sessionStorage.getItem("access_token");

  let contentType = options.contentType !== "form-data" ? { "Content-Type": "application/json" } : {};

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    cache: options.cache || "no-cache",
    method: options.method || "GET",
    headers: {
      ...options.headers,
      ...contentType,
      // "Content-Type": contentType || { "Content-Type": "application/json" },
      // "Content-Type": ...contentType,
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    },
    body: options.body || null,
    next: options.next || undefined,
    credentials: "include",
  });

  if (response.status === 401 && endpoint !== "/v1/login") {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      accessToken = sessionStorage.getItem("access_token");

      const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
        cache: options.cache || "no-cache",
        method: options.method || "GET",
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: options.body || null,
        next: options.next || undefined,
        credentials: "include",
      });

      const retryResult = await retryResponse.json();

      if (!retryResponse.ok) {
        throw retryResult;
      }

      return resp ? retryResult : retryResult.data;
    } else {
      sessionStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      throw new Error("Session expired. Please log in again.");
    }
  }

  const result = await response.json();
  if (!response.ok) {
    throw result;
  }

  return resp ? result : result.data;
};

const refreshAccessToken = async () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const response = await fetch(`${BASE_URL}/v1/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      const { access_token } = await response.json();
      sessionStorage.setItem("access_token", access_token);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return false;
  }
};

export default fetchGlobal;
