import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  decimals = 0,
  sizeType: "accurate" | "normal" = "normal",
) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}

export function formatDate(millis: number) {
  // Create a new Date object from the milliseconds
  const date = new Date(millis);

  // Define an array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayName = dayNames[date.getDay()];

  // Get the month long name
  const monthLongName = monthNames[date.getMonth()];

  // Get the day of the month
  const day = date.getDate();

  // Get the hours, minutes, and seconds
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Determine AM or PM
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'
  const hoursStr = String(hours).padStart(2, "0");

  // Format the time with AM/PM
  const time = `${hoursStr}:${minutes} ${ampm}`;

  // Return the formatted string
  // return `${monthLongName} ${day}, ${time}`;
  return { monthLongName, day, time, dayName };
}

export function urlify(str: string) {
  if (!str) return str;
  return str?.includes("http")
    ? str
    : `${process.env.NEXT_PUBLIC_API_REST_URL}/uploads/v2/` + `${str}`;
}

export function timeAgo(date: any) {
  const now = new Date().getTime();
  const past = new Date(date);
  const diffInMs = now - date;

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return (
      diffInMinutes + " minute" + (diffInMinutes !== 1 ? "s" : "") + " ago"
    );
  } else if (diffInHours < 24) {
    return diffInHours + " hour" + (diffInHours !== 1 ? "s" : "") + " ago";
  } else {
    return diffInDays + " day" + (diffInDays !== 1 ? "s" : "") + " ago";
  }
}

export const PLUS8HOURS = 8 * 60 * 60 * 1000;

export function removeNullValues(obj: any) {
  // Create a new object to store the result
  let result = {} as any;

  // Iterate over the keys of the input object
  for (let key in obj) {
    // Check if the value is not null
    if (obj[key] !== null) {
      // If the value is not null, add it to the result object
      result[key] = obj[key];
    }
  }

  // Return the result object
  return result;
}
