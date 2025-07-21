// src/types/event.ts

/**
 * Event type definition
 * ---------------------
 * Represents a single event entry pulled from Storyblok.
 * Includes metadata, location, timing, pricing, and optional image.
 */

import type { StoryblokRichTextNode } from "@storyblok/js";

export interface Event {
    objectID: string;       // Added for Algolia hits
    _uid: string;           // Unique Storyblok identifier
    title: string;          // Event title

    image?: {
        url: string;        // Image URL path
        alt?: string;       // Optional alt text for accessibility
    };

    summary: StoryblokRichTextNode; // Rich text content from Storyblok

    eventFormat: string;    // Event format

    location: string;       // Human-readable location name

    _geoloc?: {
        lat: number;        // Latitude coordinate as string
        lng: number;        // Longitude coordinate as string
    };

    start_date: string;     // ISO-formatted start date
    end_date: string;       // ISO-formatted end date

    eventType: string;      // Category or type of event
    price: number;          // Cost of entry

    [key: string]: any;     // Allows additional dynamic fields from Storyblok
}