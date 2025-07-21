import { useConnector } from "react-instantsearch";
import { connectHits } from "instantsearch.js/es/connectors";
import type { Event } from "../types/event"

export function useAllEventHits(): Event[] {
    const { hits = [] } = useConnector(connectHits, {}) as { hits: Event[] };
    return hits;
}