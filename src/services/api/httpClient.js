const BASE_URL = "http://localhost:8000/api/v1";
const UNAUTHORIZED_EVENT = "tripos:unauthorized";

function getAuthHeaders() {
  const token =
    typeof localStorage === "undefined"
      ? null
      : localStorage.getItem("accessToken");

  return token ? { Authorization: `Bearer ${token}` } : {};
}

function formatErrorDetail(responseBody) {
  if (!responseBody) {
    return "";
  }

  try {
    const errorData = JSON.parse(responseBody);
    const detail = errorData.detail;
    if (typeof detail === "string") {
      return detail;
    }
    return detail === undefined ? responseBody : JSON.stringify(detail);
  } catch {
    return responseBody;
  }
}

export async function apiRequest(path, options = {}) {
  const hasBody = options.body !== undefined;
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const detail = formatErrorDetail(await response.text());
    if (response.status === 401 && path !== "/auth/login") {
      localStorage.removeItem("accessToken");
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    throw new Error(
      `API request failed (HTTP ${response.status})${
        detail ? `: ${detail}` : "."
      }`,
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function createResourceApi(path) {
  const collectionPath = `/${path}`;

  function itemPath(id) {
    return `${collectionPath}/${encodeURIComponent(String(id))}`;
  }

  return {
    list() {
      return apiRequest(collectionPath);
    },
    getById(id) {
      return apiRequest(itemPath(id));
    },
    create(data) {
      return apiRequest(collectionPath, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    update(id, data) {
      return apiRequest(itemPath(id), {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    async remove(id) {
      const result = await apiRequest(itemPath(id), { method: "DELETE" });
      return result === null ? true : result;
    },
  };
}
