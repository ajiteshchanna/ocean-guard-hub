import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return '↗';
    case 'down':
      return '↘';
    case 'stable':
      return '→';
    default:
      return '→';
  }
};

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'text-red-500 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800';
    case 'high':
      return 'text-orange-500 bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800';
    case 'medium':
      return 'text-yellow-500 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800';
    case 'low':
      return 'text-green-500 bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800';
    default:
      return 'text-muted-foreground';
  }
};