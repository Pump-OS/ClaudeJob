import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateAgentName(): string {
  const firstNames = [
    "Alex", "Jordan", "Morgan", "Taylor", "Casey", "Riley", "Quinn", "Avery",
    "Parker", "Cameron", "Drew", "Sage", "Reese", "Blake", "Skyler", "Charlie"
  ];
  const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore",
    "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Garcia", "Lee"
  ];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

