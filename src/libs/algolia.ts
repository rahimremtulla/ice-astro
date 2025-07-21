// src/libs/algolia.ts

/**
 * Algolia client wrapper
 * ----------------------
 * Provides a function to fetch keyword autocomplete suggestions
 * from Algolia's search index, optimized for use in the SearchBar.
 */

import { algoliasearch } from 'algoliasearch';
import type { SearchResponse } from '@algolia/client-search';

// Environment variables for Algolia credentials and index
const appId = import.meta.env.PUBLIC_ALGOLIA_APP_ID!;
const searchKey = import.meta.env.PUBLIC_ALGOLIA_SEARCH_KEY!;
const indexName = import.meta.env.PUBLIC_ALGOLIA_INDEX_NAME!;

const searchClient = algoliasearch(appId, searchKey);

/**
 * Fetches keyword suggestions for autocomplete based on title field.
 *
 * @param query - user input string
 * @returns array of title strings from matching hits
 */
export async function searchKeywordSuggestions(query: string): Promise<string[]> {
    if (!query.trim()) return [];

    const results = await searchClient.search([{
        indexName,
        params: {
            query,
            hitsPerPage: 5,
            attributesToRetrieve: ['title']
        }
    }]);

    const hits = (results.results[0] as SearchResponse<any>).hits;
    return hits.map(hit => hit.title).filter(Boolean);
}