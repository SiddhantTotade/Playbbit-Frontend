/**
 * Central configuration for API and Media base URLs.
 */

const DEFAULT_API_URL = "http://localhost:8080/api";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_URL;

export const GET_ORIGIN = () => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch (e) {
    // Fallback if URL is malformed
    return API_BASE_URL.split("/api")[0];
  }
};
