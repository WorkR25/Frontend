export function timeAgo(dateString: string): string {
  const createdDate = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - createdDate.getTime(); // difference in ms
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  return `${diffSeconds} second${diffSeconds > 1 ? "s" : ""} ago`;
}

export function getFormattedDate(): string {
  const date = new Date();

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" }); // "March"
  const year = date.getFullYear();

  return `${day}, ${month}, ${year}`;
}