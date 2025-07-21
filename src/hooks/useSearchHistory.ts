// src/hooks/useSearchHistory.ts

/**
 * Custom React hook to manage recent location selections.
 * Stores up to five entries in localStorage for persistence across sessions.
 * Returns history array, setter, and utility functions to add/remove entries.
 */

import { useEffect, useState } from "react";
import type { LocationSuggestion } from "../libs/geocode";

const HISTORY_KEY = "locationSearchHistory";

export function useSearchHistory() {
    const [history, setHistory] = useState<LocationSuggestion[]>([]);

    // Load history from localStorage on initial mount
    useEffect(() => {
        const stored = localStorage.getItem(HISTORY_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as LocationSuggestion[];
                setHistory(parsed);
            } catch {
                console.warn("Invalid location history format in storage.");
            }
        }
    }, []);

    // Persist history to localStorage on change
    useEffect(() => {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }, [history]);

    // Add new location to history (de-duped, max 5 entries)
    const add = (place: LocationSuggestion) => {
        setHistory(prev => {
            const filtered = prev.filter(p => p.placeName !== place.placeName);
            return [place, ...filtered].slice(0, 5);
        });
    };

    // Remove location by it's place name
    const remove = (placeName: string) => {
        setHistory(prev => prev.filter(p => p.placeName !== placeName));
    };

    return { history, setHistory, add, remove };
}