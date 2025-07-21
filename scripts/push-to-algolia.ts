// scripts/push-to-algolia.ts

/**
 * Push-to-Algolia script
 * ----------------------
 * Fetches published event data from Storyblok and indexes it into Algolia.
 * Requires environment variables for Algolia credentials and index name.
 * Intended to be run manually or as part of a deployment pipeline.
 */

import "dotenv/config";
import { algoliasearch } from "algoliasearch";
import storyblokApi from "../src/libs/storyblok";
import type { Event } from "../src/types/event";

// Load Algolia credentials from environment
const appId = process.env.PUBLIC_ALGOLIA_APP_ID!;
const adminKey = process.env.ALGOLIA_ADMIN_KEY!;
const indexName = process.env.ALGOLIA_INDEX_NAME!;

if (!appId || !adminKey || !indexName) {
    throw new Error("Missing Algolia config in .env");
}

const client = algoliasearch(appId, adminKey);

/**
 * Fetches event data from Storyblok and transforms it for Algolia indexing.
 *
 * @returns array of Algolia-ready event objects
 */
async function fetchEventsFromStoryblok(): Promise<Event[]> {
    const { data } = await storyblokApi.get("cdn/stories/events", {
        version: "published" // Or 'draft'
    });

    const body = data.story.content.body || [];
    const eventListBlock = body.find((block: any) => block.component === "eventList");
    const events = eventListBlock?.events || [];

    type StoryblokEvent = {
        _uid: string;
        title: string;
        image?: {
            filename: string;
            alt?: string;
        };
        summary: any;
        location: string;
        latitude: string;
        longitude: string;
        event_format: string;
        event_type: string;
        start_date: string;
        end_date: string;
        slug: string;
        price: number;
    };

    return events.map((event: StoryblokEvent) => {
        const hasGeo = event.latitude && event.longitude;

        return {
            objectID: event._uid,
            title: event.title,
            summary: event.summary,
            location: event.location,
            ...(hasGeo && {
                _geoloc: {
                    lat: parseFloat(event.latitude),
                    lng: parseFloat(event.longitude),
                },
            }),
            eventFormat: event.event_format,
            eventType: event.event_type,
            startDate: event.start_date,
            startTimestamp: new Date(event.start_date).getTime(),
            endDate: event.end_date,
            endTimestamp: new Date(event.end_date).getTime(),
            slug: event.slug,
            image: {
                url: event.image?.filename || "",
                alt: event.image?.alt || "",
            },
            price: event.price,
        };
    });
}

// Execute indexing script
(async () => {
    const events = await fetchEventsFromStoryblok();

    const responses = await client.saveObjects({
        indexName,
        objects: events
    });

    // Extract objectIDs from each response
    const objectIDs = responses.flatMap(response => response.objectIDs ?? []);

    console.log(`Indexed ${objectIDs.length} events into Algolia`);
})();