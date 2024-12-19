import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (
  amount: number | string | null,
  currencySymbol: string = "₦"
): string => {
  // Convert the amount to a number if it's a string
  const numericAmount = typeof amount === "string" ? Number(amount) : amount;

  // Format the number with commas
  const formattedAmount = numericAmount?.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return `${currencySymbol} ${amount != null ? formattedAmount : 0}`;
};

export const AppendToSnakeCase = (input: string): string => {
  if (!input) return "";
  return input
    .trim() // Remove extra spaces at the start and end
    .replace(/\s+/g, "_") // Replace all spaces with underscores
    .toLowerCase(); // Convert the entire string to lowercase
};

export const formatSnakeCase = (input: string): string => {
  if (!input) return "";
  return input
    .split("_") // Split the string by underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" "); // Join with a space
};
