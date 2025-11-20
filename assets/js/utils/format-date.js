export function formatDate(unix) {
  const date = new Date(unix * 1000);
  return date.toLocaleDateString("en-GB", { weekday: "short" });
}


export function isTodayCheck(date) {
  return new Date(date * 1000).toDateString() === new Date().toDateString();
}