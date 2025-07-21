// src/components/events/EventCardLite.tsx

/**
 * EventCardLite
 * -------------
 * A reusable UI card for displaying individual event details.
 * Dynamically shows image, title, location and cost.
 * Relies on data from Storyblok and Algolia-fed Event types.
 */

import React from "react";
import type { Event } from "../../types/event";
import { formatEventDate } from "../../utils/dateFormatter";
import { formatEventLocation } from "../../utils/locationFormatter";

type EventCardLiteProps = {
  event: Event;
};

export default function EventCardLite({ event }: EventCardLiteProps) {
    // Compose image URL with CDN transformation, fallback if missing
    const imageUrl = event.image?.url
    ? `${event.image.url}/m/600x300/filters:quality(80):format(webp)`
    : "https://placehold.net/default.svg";

    // Format dates as range or single string
    const formatted = formatEventDate(event.startDate, event.endDate);

    // Convert price to GBP currency string, or "Free"
    const formattedPrice =
    event.price == null || Number(event.price) === 0
    ? "Free"
    : `From ${new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
    }).format(event.price)} (Excl. VAT)`;

    return (
        <div className="flex gap-4">
            {/* Event Image */}
            {event.image?.url && (
                <figure className="flex-[0_0_33.5%] aspect-[16/9] w-full overflow-hidden">
                    <img
                    src={imageUrl}
                    alt={event.image.alt || event.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    />
                </figure>
            )}
            <div className="flex-1">
                {/* Event Details */}
                <div className="flex flex-col flex-1 gap-3">
                    {/* Event Title */}
                    <h3 className="text-base font-bold text-gray-900 max-w-[90%]">
                        <a href="#" className="hover:underline">
                            {event.title}
                        </a>
                    </h3>

                    {/* Event Dates */}
                    {typeof formatted === "string" ? (
                        <p className="text-sm text-gray-600">{formatted}</p>
                        ) : (
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>{formatted.start}</p>
                            <p>{formatted.end}</p>
                        </div>
                    )}

                    {/* Location */}
                    {["online", "in-person", "hybrid"].includes(event.eventFormat?.toLowerCase()) &&
                    formatEventLocation(event)}

                    {/* Price */}
                    <div className="mt-auto">
                        <p className="text-sm font-bold text-red-600">{formattedPrice}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}