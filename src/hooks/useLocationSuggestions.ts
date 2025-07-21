// src/hooks/useLocationSuggestions.ts

/**
 * Custom React hook for triggering location autocomplete via `suggestCities`.
 * It conditionally fires based on input length, focus state, and external toggles.
 * 
 * @param location - the current location input string
 * @param focusedLocation - whether the location input is focused
 * @param shouldSuggest - whether suggestion logic should be active
 * @returns an object with suggestions list and a setter for it
 */

import { useEffect, useState } from "react";
import { suggestCities } from "../libs/geocode";
import type { LocationSuggestion } from "../libs/geocode";

export function useLocationSuggestions({
    location,
    focusedLocation,
    shouldSuggest
}: {
    location: string;
    focusedLocation: boolean;
    shouldSuggest: boolean;
}) {
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);

    useEffect(() => {
        // Do not trigger suggestions if unfocused, too short, or suggestion logic is disabled
        if (!focusedLocation || location.trim().length < 2 || !shouldSuggest) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            const results = await suggestCities(location);
            setSuggestions(results);
        };

        fetchSuggestions();
    }, [location, focusedLocation, shouldSuggest]);

    return { suggestions, setSuggestions };
}