export function formatDate(unix) {
  const date = new Date(unix * 1000);
  return date.toLocaleDateString("en-GB", { weekday: "short" });
}

export function formatDateTime(unix) {
  const date = new Date(unix * 1000);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const mins = String(minutes).padStart(2, "0");
  return `${hours}:${mins} ${ampm}`;
}

export function isTodayCheck(date) {
  return new Date(date * 1000).toDateString() === new Date().toDateString();
}
