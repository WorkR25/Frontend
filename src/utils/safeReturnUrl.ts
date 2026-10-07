/** Only allow same-site paths as post-login redirects (blocks "//evil.com" and absolute URLs). */
export function safeReturnUrl(value: string | null | undefined, fallback = "/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  return value;
}
