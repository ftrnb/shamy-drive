import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace("MAD", "DH");
}

export function calculateDays(start: string | Date, end: string | Date): number {
  const s = new Date(start);
  const e = new Date(end);
  const diff = e.getTime() - s.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isValidDateRange(start: string, end: string): boolean {
  if (!start || !end) return false;
  const s = new Date(`${start}T00:00:00`);
  const e = new Date(`${end}T00:00:00`);
  return e > s && s >= new Date(new Date().toISOString().split("T")[0] + "T00:00:00");
}
