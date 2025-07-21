// src/components/events/EventCard.tsx

/**
 * EventCard
 * ---------
 * A reusable UI card for displaying individual event details.
 * Dynamically shows image, title, metadata, formatted summary and cost.
 * Relies on data from Storyblok and Algolia-fed Event types.
 */

import React from "react";
import type { Event } from "../../types/event";
import { richTextResolver } from "@storyblok/richtext";
import { formatEventDate } from "../../utils/dateFormatter";
import { formatEventLocation } from "../../utils/locationFormatter";

type EventCardProps = {
    event: Event;
};

export default function EventCard({ event }: EventCardProps) {
    // Compose image URL with CDN transformation, fallback if missing
    const imageUrl = event.image?.url
    ? `${event.image.url}/m/600x300/filters:quality(80):format(webp)`
    : "https://placehold.net/default.svg";

    // Format dates as range or single string
    const formatted = formatEventDate(event.startDate, event.endDate);

    // Render rich text summary as HTML (from Storyblok)
    const summaryHtml =
    event.summary?.content?.length > 0
    ? richTextResolver().render(event.summary)
    : null;

    // Convert price to GBP currency string, or "Free"
    const formattedPrice =
    event.price == null || Number(event.price) === 0
    ? "Free"
    : `From ${new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
    }).format(event.price)} (Excl. VAT)`;

    return (
        <article className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
            {/* Event Image */}
            {event.image?.url && (
                <figure className="aspect-[16/9] w-full overflow-hidden">
                    <img
                    src={imageUrl}
                    alt={event.image.alt || event.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    />
                </figure>
            )}

            {/* Event Details */}
            <div className="flex flex-col flex-1 p-4 gap-3">
                {/* Event Type Tag */}
                {event.eventType?.trim() && (
                    <span className="inline-block bg-primary text-white text-xs px-3 py-1.5 rounded-full uppercase tracking-wide font-semibold w-fit">
                        {event.eventType.replace(/-/g, " ")}
                    </span>
                )}

                {/* Event Title */}
                <h3 className="text-base font-bold text-gray-900">
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

                {/* Summary */}
                {summaryHtml ? (
                    <div
                    className="text-sm prose prose-sm max-w-none text-gray-700 line-clamp-5"
                    dangerouslySetInnerHTML={{ __html: summaryHtml }}
                    />
                ) : (
                    <p className="text-gray-500 text-sm italic">No summary provided.</p>
                )}

                {/* Price */}
                <div className="mt-auto">
                    <p className="text-lg font-bold text-red-600">{formattedPrice}</p>
                </div>
            </div>
        </article>
    );
}