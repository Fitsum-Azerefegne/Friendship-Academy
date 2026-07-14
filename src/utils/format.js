export function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function formatDateShort(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return { month: "", day: "" };
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }),
    day: date.toLocaleDateString("en-US", { day: "numeric" }),
  };
}
