// src/components/events/search/PaginationControls.tsx

/**
 * PaginationControls
 * ------------------
 * Renders custom pagination buttons for navigating Algolia InstantSearch results.
 * Uses `useConnector` with `connectPagination` to hook into the search context.
 * Limits to 20 pages (configurable) and highlights the current page.
 */

import React from "react";
import { useConnector } from "react-instantsearch";
import { connectPagination } from "instantsearch.js/es/connectors";

export default function PaginationControls() {
    // Connect to pagination state via Algolia's connector hook
    const pagination = useConnector(connectPagination, {
        totalPages: 20, // Optional: cap pagination at 20 pages
    });

    // Safety check: if the connector hasn't returned data yet
    if (!pagination) return null;

    const {
        currentRefinement,  // Current active page index (0-based)
        nbPages,            // Total number of pages
        refine,             // Function to set a new page
        isFirstPage,
        isLastPage,
        pages               // Array of visible page indexes
    } = pagination;

    // If there's only one page, no need to render pagination
    if (nbPages <= 1) return null;

    return (
        <div className="flex justify-center mt-6 gap-2">
            {/* Previous Page Button */}
            <button
            onClick={() => refine(currentRefinement - 1)}
            disabled={isFirstPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Prev
            </button>

            {/* Page Number Buttons */}
            {pages.map((page) => (
                <button
                key={page}
                onClick={() => refine(page)}
                className={`px-3 py-1 border rounded ${
                page === currentRefinement ? "bg-primary text-white" : ""
                }`}
                >
                    {page + 1}
                </button>
            ))}

            {/* Next Page Button */}
            <button
            onClick={() => refine(currentRefinement + 1)}
            disabled={isLastPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}