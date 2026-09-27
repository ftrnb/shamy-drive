export type SavedSearch = {
  pickupDate: string;
  returnDate: string;
  location: string;
};

const KEY = "shamy-search";

function isValidDateStr(d: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  const today = new Date().toISOString().split("T")[0];
  return d >= today;
}

export function saveSearch(s: SavedSearch) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* private mode — ignore */
  }
}

export function readSearch(): Partial<SavedSearch> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const s = JSON.parse(raw) as SavedSearch;
    const out: Partial<SavedSearch> = {};
    if (s.pickupDate && isValidDateStr(s.pickupDate)) out.pickupDate = s.pickupDate;
    if (s.returnDate && isValidDateStr(s.returnDate)) out.returnDate = s.returnDate;
    if (out.pickupDate && out.returnDate && out.returnDate <= out.pickupDate) delete out.returnDate;
    if (typeof s.location === "string" && s.location.trim()) out.location = s.location;
    return out;
  } catch {
    return {};
  }
}
