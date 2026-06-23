// Format a number as Bangladeshi Taka currency
export const formatPrice = (price) => {
  if (price === null || price === undefined) return "";
  return `BDT ${Number(price).toLocaleString("en-BD")}`;
};

// Backend origin - derived from VITE_API_URL (strip trailing /api)
// In local dev (VITE_API_URL unset), returns "" so /uploads/.. goes through Vite proxy.
const API_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");

// Resolve image URL - handles both relative /uploads paths and full URLs
export const resolveImage = (imgPath, fallback = "/placeholder.jpg") => {
  if (!imgPath) return fallback;
  if (imgPath.startsWith("http")) return imgPath;
  return `${API_ORIGIN}${imgPath}`;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Map package type to display label
export const typeLabel = {
  hajj: "Hajj",
  umrah: "Umrah",
  tour: "Holiday",
};
