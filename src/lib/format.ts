export function formatMonthYear(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(`${date.slice(0, 10)}T12:00:00`));
}

export function formatExperienceDates(start: string, end: string | null) {
  return `${formatMonthYear(start)} – ${end ? formatMonthYear(end) : "Present"}`;
}