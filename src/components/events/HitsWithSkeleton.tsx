// src/components/events/HitsWithSkeleton.tsx

/**
 * HitsWithSkeleton
 * ----------------
 * Displays Algolia search results with animated skeleton placeholders.
 * Uses InstantSearch connector to fetch hits.
 * Shows skeleton cards when `showSkeletons` is true, real events otherwise.
 * Triggers `onHitsUpdate` when hits change (based on length or first result).
 */

import React, { useEffect, useRef } from "react";
import { useConnector } from "react-instantsearch";
import { connectHits } from "instantsearch.js/es/connectors";

import EventCard from "./EventCard";
import type { Event } from "../../types/event";
import "../../styles/skeleton.css";

type Props = {
    showSkeletons: boolean;     // Controls whether skeletons should be visible
    onHitsUpdate: () => void;   // Callback to notify parent when hits change
};

export default function HitsWithSkeleton({ showSkeletons, onHitsUpdate }: Props) {
    // Use Algolia connector to get search hits
    const connector = useConnector(connectHits) as { hits: Event[] };
    const hits = connector?.hits || [];

    // Ref to track previous hit state for shallow comparison
    const previousHitsRef = useRef<Event[]>([]);

    useEffect(() => {
        // Compare length or first item to detect hit changes
        const previousHits = previousHitsRef.current;
        const isChanged =
        hits.length !== previousHits.length ||
        (hits.length > 0 && previousHits.length > 0 &&
        hits[0].objectID !== previousHits[0].objectID);

        if (isChanged) {
            onHitsUpdate(); // Notify parent to trigger skeleton animation
        }

        // Update ref with current hits for next comparison
        previousHitsRef.current = hits;
    }, [hits, onHitsUpdate]);

    // Fallback count to show placeholder cards
    const skeletonCount = hits.length || 3;

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {showSkeletons ? (
                // Render skeleton cards while loading
                Array.from({ length: skeletonCount }).map((_, i) => (
                    <div
                    key={i}
                    className="animate-pulse bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col h-full"
                    >
                        {/* Image placeholder (16:9 aspect ratio) */}
                        <div className="skeleton bg-gray-200 w-full aspect-[16/9]" />

                        {/* Simulated content blocks */}
                        <div className="flex flex-col flex-1 p-4 gap-3">
                            <div className="skeleton bg-gray-200 w-1/2 h-6 rounded-full" />     {/* Event type tag */}
                            <div className="skeleton bg-gray-300 w-3/4 h-5 rounded" />          {/* Title */}
                            <div className="skeleton bg-gray-100 w-full h-3 rounded" />         {/* Date line 1 */}
                            <div className="skeleton bg-gray-100 w-5/6 h-3 rounded" />          {/* Date line 2 */}
                            <div className="skeleton bg-gray-100 w-2/3 h-3 rounded" />          {/* Location */}
                            <div className="skeleton bg-gray-100 w-full h-12 rounded" />        {/* Summary */}
                            <div className="skeleton bg-gray-300 w-1/3 h-5 rounded mt-auto" />  {/* Cost */}
                        </div>
                    </div>
                ))
            ) : hits.length === 0 ? (
                // Display message if no hits were found
                <p className="text-gray-500 col-span-full text-center">No events found.</p>
            ) : (
                // Render actual event results
                hits.map((hit) => <EventCard key={hit.objectID} event={hit} />)
            )}
        </div>
    );
}