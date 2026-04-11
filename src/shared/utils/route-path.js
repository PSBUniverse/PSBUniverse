const ABSOLUTE_HTTP_URL_PATTERN = /^https?:\/\//i;
const URI_SCHEME_PATTERN = /^[a-z][a-z\d+.-]*:/i;

export function normalizeRoutePath(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  // Convert absolute HTTP(S) URLs to app-relative routes so hostnames are never persisted.
  if (ABSOLUTE_HTTP_URL_PATTERN.test(raw)) {
    try {
      const parsed = new URL(raw);
      const normalizedPath = `${parsed.pathname || "/"}${parsed.search || ""}${parsed.hash || ""}`;
      return normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
    } catch {
      return "";
    }
  }

  // Keep non-HTTP URI schemes intact (for example: mailto:, tel:).
  if (URI_SCHEME_PATTERN.test(raw)) {
    return raw;
  }

  if (raw.startsWith("/")) {
    return raw;
  }

  return `/${raw.replace(/^\/+/, "")}`;
}
