/**
 * Central configuration for API and Media base URLs.
 */

// Use relative path for browser-side requests so it automatically uses the correct IP/Host.
// For server-side requests (Next.js server), fallback to 127.0.0.1.
const DEFAULT_API_URL = typeof window !== "undefined" 
  ? "/api" 
  : (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:1996/api");

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
export const GET_ORIGIN = () => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch (e) {
    // Fallback if URL is malformed
    return API_BASE_URL.split("/api")[0];
  }
};
