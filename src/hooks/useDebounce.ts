// src/hooks/useDebounce.ts

/**
 * A generic React hook that delays updates to a value until after a specified time.
 * Useful for limiting how often functions (E.g. search, API calls) trigger while a user types.
 *
 * @param value - the input value to debounce
 * @param delay - debounce delay time in milliseconds
 * @returns the debounced value
 */

import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Start timer to update debounced value after delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cancel timeout if value or delay changes before timer completes
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}