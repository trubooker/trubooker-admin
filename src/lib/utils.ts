import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (
  amount: number | string,
  currencySymbol: string = "₦"
): string => {
  // Convert the amount to a number if it's a string
  const numericAmount = typeof amount === "string" ? Number(amount) : amount;

  // Format the number with commas
  const formattedAmount = numericAmount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return `${currencySymbol} ${formattedAmount}`;
};
