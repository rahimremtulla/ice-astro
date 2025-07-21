// src/components/events/search/EventStats.tsx

/**
 * EventStats
 * ----------
 * Displays a summary of search results returned from Algolia InstantSearch,
 * including the number of events and a button to toggle map view.
 * 
 * Props:
 * - showSkeletons: Indicates whether to show loading text during data fetch.
 * - onMapToggle: Callback function to trigger the map modal from parent component.
 * 
 * Behavior:
 * - Dynamically shows total results text based on the search response.
 * - Prevents default behavior when the "View on map" button is clicked.
 * - Uses environment variable to determine page size.
 */

import React from "react";
import { useInstantSearch } from "react-instantsearch";

const hitsPerPageEnv = Number(import.meta.env.PUBLIC_ALGOLIA_HITS_PER_PAGE) || 12;

interface Props {
    showSkeletons: boolean;
    onMapToggle: () => void; // Function passed from parent (EventSearchWrapper)
}

export default function EventStats({ showSkeletons, onMapToggle }: Props) {
    const { results } = useInstantSearch();
    const total = results?.nbHits ?? 0;
    const pageSize = Number(import.meta.env.PUBLIC_ALGOLIA_HITS_PER_PAGE) || 12;

    const displayText =
    total > pageSize
    ? `Showing ${results?.hits.length} of ${total} events`
    : `Showing ${total} event${total === 1 ? "" : "s"}`;

    // Prevent the page navigation or refresh when clicking the button
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent any default behavior like navigation
        onMapToggle(); // Trigger the modal visibility
    };

    return (
        <div className="flex justify-between items-center text-sm text-gray-600 px-1">
            <span>{showSkeletons ? "Loading events..." : displayText}</span>
            <button
            onClick={handleClick} // Use handleClick to prevent any default behavior
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                View on map
            </button>
        </div>
    );
}