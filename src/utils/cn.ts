import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function calculateStayTotal(guests: number, nights: number, packagePrice: number): number {
  const g = Math.max(1, guests || 1);
  const n = Math.max(1, nights || 1);
  return g * n * packagePrice;
}
