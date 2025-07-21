// src/components/events/EventSearchWrapper.tsx

/**
 * EventSearchWrapper
 * ------------------
 * This component wraps the entire Algolia-powered event search experience.
 * It includes the search bar, filters, event stats, paginated results,
 * and a modal map view of geolocated events.
 */

import React, { useState, useEffect, lazy, Suspense } from "react";
import { InstantSearch, Configure, useConnector, } from "react-instantsearch";
import { connectHits } from "instantsearch.js/es/connectors";
import { algoliasearch } from "algoliasearch";

import SearchBar from "../events/search/SearchBar";
import EventStats from "./search/EventStats";
const MapModal = lazy(() => import("../events/map/MapModal"));
import FilterPanel from "../events/filters/FilterPanel";
import HitsWithSkeleton from "../events/HitsWithSkeleton";
import PaginationControls from "./search/PaginationControls";
import AllEventHitsProvider from "./AllEventHitsProvider";
import { useAllEventHits } from "../../hooks/useAllEventHits";
import type { Event } from "../../types/event";

// Algolia setup
const searchClient = algoliasearch(
    import.meta.env.PUBLIC_ALGOLIA_APP_ID!,
    import.meta.env.PUBLIC_ALGOLIA_SEARCH_KEY!
);
const indexName = import.meta.env.PUBLIC_ALGOLIA_INDEX_NAME!;
const hitsPerPage = Number(import.meta.env.PUBLIC_ALGOLIA_HITS_PER_PAGE) || 12;
const DEMO_DELAY_MS = import.meta.env.PUBLIC_DEMO_MODE === "true" ? 1500 : 0;

/**
 * useEventHits
 * ------------------
 * Custom hook to access Algolia hits using the connectHits connector.
 */
function useEventHits(): Event[] {
    const { hits = [] } = useConnector(connectHits, {}) as { hits: Event[] };
    return hits;
}

export default function EventSearchWrapper() {
    const [showPagination, setShowPagination] = useState(false);
    const [showSkeletons, setShowSkeletons] = useState(true);
    const [showMapModal, setShowMapModal] = useState(false);

    // Delay pagination appearance for demo mode
    useEffect(() => {
        const timer = setTimeout(() => setShowPagination(true), DEMO_DELAY_MS);
        return () => clearTimeout(timer);
    }, []);

    // Trigger skeleton loading animation when hits update
    const handleHitsUpdate = () => {
        setShowSkeletons(true);
        setTimeout(() => {
            setShowSkeletons(false);
        }, DEMO_DELAY_MS);
    };

    return (
        <InstantSearch
        searchClient={searchClient}
        indexName={indexName}
        future={{ preserveSharedStateOnUnmount: true }}
        >
            <Configure hitsPerPage={hitsPerPage} />
            
            { /* Top search bar */}
            <SearchBar />

            <section className="grid lg:grid-cols-[300px_1fr] gap-6 mt-6">
                { /* Left pane filters */}
                <FilterPanel />

                { /* Right pane */}
                <div className="flex flex-col gap-8">
                    { /* Status bar including map button */}
                    <EventStats
                    showSkeletons={showSkeletons}
                    onMapToggle={() => setShowMapModal(true)}
                    />

                    { /* Event list */}
                    <HitsWithSkeleton
                    showSkeletons={showSkeletons}
                    onHitsUpdate={handleHitsUpdate}
                    />

                    { /* Event list pagination */}
                    {showPagination && <PaginationControls />}
                </div>
            </section>

            { /* Map modal */}
            {showMapModal && (
                <Suspense fallback={null}>
                    <EventModalHits onClose={() => setShowMapModal(false)} />
                </Suspense>
            )}
        </InstantSearch>
    );
}

/**
* EventModalHits
* -----------------------
* Filters Algolia hits based on _geoloc and passes typed events to the map modal.
*/
function EventModalHits({ onClose }: { onClose: () => void }) {
  return (
    <AllEventHitsProvider>
      <EventMapContent onClose={onClose} />
    </AllEventHitsProvider>
  );
}

function EventMapContent({ onClose }: { onClose: () => void }) {
  const hits = useAllEventHits();

  const typedEvents = hits.filter((e) =>
    e._geoloc &&
    !isNaN(Number(e._geoloc.lat)) &&
    !isNaN(Number(e._geoloc.lng))
  ).map((e) => ({
    ...e,
    _geoloc: {
      lat: Number(e._geoloc!.lat),
      lng: Number(e._geoloc!.lng),
    },
  }));

  return <MapModal events={typedEvents} onClose={onClose} />;
}