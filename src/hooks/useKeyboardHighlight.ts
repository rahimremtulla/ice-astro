// src/hooks/useKeyboardHighlight.ts

/**
 * Generic React hook for managing the currently highlighted index within
 * keyboard-navigable dropdowns (E.g., autocomplete, suggestion menus).
 *
 * @param items - the array of items to navigate
 * @returns highlighted index and navigation helpers
 */

import { useState } from "react";

export function useKeyboardHighlight<T>(items: T[]) {
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

    const moveDown = () => {
        setHighlightedIndex((prev) =>
            prev === null || prev >= items.length - 1 ? 0 : prev + 1
        );
    };

    const moveUp = () => {
        setHighlightedIndex((prev) =>
            prev === null || prev <= 0 ? items.length - 1 : prev - 1
        );
    };

    const reset = () => setHighlightedIndex(null);

    return {
        highlightedIndex,
        setHighlightedIndex,
        moveDown,
        moveUp,
        reset
    };
}