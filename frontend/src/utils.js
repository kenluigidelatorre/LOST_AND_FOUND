export const CATEGORIES = [
  "ID / Documents",
  "Bags",
  "Electronics",
  "Accessories",
  "Clothing",
  "Others",
];
export const fmtDate = (d) =>
  d
    ? new Date(d.length === 10 ? d + "T00:00:00" : d).toLocaleDateString(
        "en-US",
        { month: "short", day: "2-digit", year: "numeric" },
      )
    : "";
export const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};
