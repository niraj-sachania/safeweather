export function formatDate(unix) {
  const date = new Date(unix * 1000);
  return date.toLocaleDateString("en-GB", { weekday: "short" });
}

export function formatDateTime(unix) {
  const date = new Date(unix * 1000);
  return date
    .toLocaleString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "");
}

export function isTodayCheck(date) {
  return new Date(date * 1000).toDateString() === new Date().toDateString();
}
