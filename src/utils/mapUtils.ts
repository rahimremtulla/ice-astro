// src/utils/mapUtils.ts

import type { Event } from "../types/event";

// User's location:
export const USER_POSTCODE = "M3 1AR";
export const USER_COORDS = {
  lat: 53.488245593667486,
  lng: -2.243694288138583,
};

// New utility:
export function isUKEvent(event: Event): boolean {
  const lat = Number(event._geoloc?.lat);
  const lng = Number(event._geoloc?.lng);

  const isValidCoords = !isNaN(lat) && !isNaN(lng);

  const inUKBounds = lat >= 49.5 && lat <= 61 && lng >= -11 && lng <= 2;

  return isValidCoords && inUKBounds;
}