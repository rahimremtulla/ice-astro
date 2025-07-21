// src/components/events/map/EventDetailOverlay.tsx

/**
 * EventDetailOverlay
* -------------------
 * This component displays a floating overlay panel on the map view
 * that shows details about a selected event. It handles three main states:
 * 
 * 1. Initial loading state (when data is being fetched for the first time).
 * 2. Loading state after data has been loaded once (shows a skeleton loader).
 * 3. Loaded state (displays the actual event details using EventCardLite).
 *
 * Props:
 * - event: The selected event object (or null if none is selected).
 * - isPanelLoading: Whether the panel is currently loading data.
 * - hasLoadedOnce: Whether the panel has successfully loaded data at least once.
 * - isEventCardClosed: Whether the event card has been manually closed.
 * - onClose: Callback function to close the event card.
 */

import React from "react";
import type { Event } from "../../../types/event";
import EventCardLite from "../../events/EventCardLite";
import { X } from "lucide-react";

export function EventDetailOverlay({
    event,
    isPanelLoading,
    hasLoadedOnce,
    isEventCardClosed,
    onClose
}: {
    event: Event | null;
    isPanelLoading: boolean;
    hasLoadedOnce: boolean;
    isEventCardClosed: boolean;
    onClose: () => void;
}) {
    if (!event || isEventCardClosed) return null;

    if (isPanelLoading && !hasLoadedOnce) {
        return (
            <div className="absolute right-0 bottom-[20px] left-0 w-full h-16 max-w-[600px] mx-auto z-[1000]">
                <div className="flex items-center justify-center bg-white border border-gray-200 font-sans text-base text-muted text-opacity-75 h-full rounded-lg shadow-md hover:shadow-lg px-7 transition">
                    <div className="animate-spin border-4 border-black border-t-transparent rounded-full w-6 h-6" />
                    <span className="ml-3">Finding event details…</span>
                </div>
            </div>
        );
    }

    if (isPanelLoading && hasLoadedOnce && !isEventCardClosed) {
        return (
            <div className="absolute right-0 bottom-[20px] left-0 w-full max-w-[600px] mx-auto z-[1000]">
                <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg p-4 transition animate-pulse">
                    <div className="flex gap-3">
                        <div className="flex-[0_0_32.5%] w-full aspect-video">
                            <div className="bg-gray-300 w-full h-full rounded" />
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-col gap-3">
                                <div className="h-6 w-3/4 bg-gray-300 rounded" />
                                <div className="h-4 w-2/3 bg-gray-200 rounded" />
                                <div className="h-4 w-1/2 bg-gray-100 rounded" />
                                <div className="h-4 w-1/3 bg-gray-100 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute right-0 bottom-[20px] left-0 w-full max-w-[600px] mx-auto z-[1000]">
            <button
            onClick={onClose}
            aria-label="Close event card"
            className="absolute top-4 right-4 flex items-center justify-center z-[1000] bg-gray-800 font-semibold text-sm text-white w-8 h-8 rounded-full shadow-md hover:bg-gray-700 transition cursor-pointer"
            >
                <X className="w-4 h-4" />
            </button>
            <div className="bg-white border border-gray-200 font-sans text-base text-muted text-opacity-75 rounded-lg shadow-md hover:shadow-lg p-4 transition">
                <EventCardLite event={event} />
            </div>
        </div>
    );
}