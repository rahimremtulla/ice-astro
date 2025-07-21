// src/components/events/AllEventHitsProvider.tsx

import React from "react";
import { InstantSearch, Configure } from "react-instantsearch";
import { algoliasearch } from "algoliasearch";

const searchClient = algoliasearch(
  import.meta.env.PUBLIC_ALGOLIA_APP_ID!,
  import.meta.env.PUBLIC_ALGOLIA_SEARCH_KEY!
);

const indexName = import.meta.env.PUBLIC_ALGOLIA_INDEX_NAME!;
const MAX_HITS = 1000;

export default function AllEventHitsProvider({ children }: { children: React.ReactNode }) {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indexName}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <Configure hitsPerPage={MAX_HITS} />
      {children}
    </InstantSearch>
  );
}