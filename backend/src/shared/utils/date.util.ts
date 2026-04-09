
export function toUTCDateOnly(date: Date | string): Date {
  const d = new Date(date);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function toDateString(date: Date | string): string {
  return toUTCDateOnly(date).toISOString().split("T")[0];
}