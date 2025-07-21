// src/hooks/useKeywordSuggestions.ts

/**
 * Custom React hook that returns keyword autocomplete suggestions via Algolia.
 * It uses debounced input to avoid excessive network calls during fast typing.
 *
 * @param keyword - the raw keyword string typed by the user
 * @returns string[] - an array of suggestion strings
 */

import { useEffect, useState } from "react";
import { searchKeywordSuggestions } from "../libs/algolia";
import { useDebounce } from "./useDebounce";

export function useKeywordSuggestions(keyword: string) {
    const debouncedKeyword = useDebounce(keyword, 250);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedKeyword.trim().length < 2) {
                setSuggestions([]);
                return;
            }

            const results = await searchKeywordSuggestions(debouncedKeyword);
            setSuggestions(results);
        };

        fetchSuggestions();
    }, [debouncedKeyword]);

    return suggestions;
}