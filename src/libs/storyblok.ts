// src/libs/storyblok.ts

/**
 * Storyblok API client setup
 * --------------------------
 * Initialises the Storyblok JavaScript SDK with the API plugin.
 * Supports both Node (process.env) and Astro (import.meta.env) environments.
 * Throws on missing token or failed initialisation.
 */

import { storyblokInit, apiPlugin } from "@storyblok/js";
import type { SbInitResult } from "@storyblok/js";

// Load access token from environment (Node or Astro)
const accessToken =
process.env.PUBLIC_STORYBLOK_TOKEN || import.meta.env.PUBLIC_STORYBLOK_TOKEN;

if (!accessToken) {
    throw new Error("Missing PUBLIC_STORYBLOK_TOKEN in environment variables.");
}

// Initialise Storyblok client with API plugin
const sbInit: SbInitResult = storyblokInit({
    accessToken,
    use: [apiPlugin]
});

if (!sbInit.storyblokApi) {
    throw new Error("Storyblok API failed to initialise.");
}

// Export configured API client
const storyblokApi = sbInit.storyblokApi;
export default storyblokApi;