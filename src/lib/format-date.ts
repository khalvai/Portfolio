const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "2-digit",
  timeZone: "UTC",
});

export function formatDate(date: string) {
  return dateFormatter.format(new Date(date));
}
