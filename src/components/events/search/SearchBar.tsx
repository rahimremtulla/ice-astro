// src/components/events/search/SearchBar.tsx

/**
 * SearchBar component combines keyword and location inputs for event search.
 * It handles search refinement, autocomplete suggestions, current location resolution,
 * and triggers Algolia InstantSearch updates via <Configure>.
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Configure, useSearchBox } from "react-instantsearch";
import KeywordInput from "./KeywordInput";
import LocationInput from "./LocationInput";
import SearchButton from "./SearchButton";

import type { LocationSuggestion } from "../../../libs/geocode";
import { geocodeCity } from "../../../libs/geocode";
import { useKeywordSuggestions } from "../../../hooks/useKeywordSuggestions";
import { useLocationSuggestions } from "../../../hooks/useLocationSuggestions";
import { useSearchHistory } from "../../../hooks/useSearchHistory";
import { useGeolocation } from "../../../hooks/useGeolocation";
import { useKeyboardHighlight } from "../../../hooks/useKeyboardHighlight";

// Optional trending keywords shown when the keyword input is empty
const trendingKeywords = [
    "dissemination seminar",
    "smeaton lecture",
    "quarry tips",
    "ravensthorpe station",
    "rocket"
];

export default function SearchBar() {
    const { query, refine } = useSearchBox();

    // --- Keyword search ---
    const [keyword, setKeyword] = useState(query);
    const keywordSuggestions = useKeywordSuggestions(keyword);
    const [showKeywordSuggestions, setShowKeywordSuggestions] = useState(true);
    const {
        highlightedIndex: highlightedKeywordIndex,
        setHighlightedIndex: setHighlightedKeywordIndex,
        moveDown: moveDownKeyword,
        moveUp: moveUpKeyword,
        reset: resetKeyword
    } = useKeyboardHighlight(keywordSuggestions);
    const {
        highlightedIndex: highlightedTrendingIndex,
        setHighlightedIndex: setHighlightedTrendingIndex,
        moveDown: moveDownTrending,
        moveUp: moveUpTrending,
        reset: resetTrending
    } = useKeyboardHighlight(trendingKeywords);

    // --- Location search ---
    const [location, setLocation] = useState("");
    const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
    const [focusedLocation, setFocusedLocation] = useState(false);
    const [locationTyping, setLocationTyping] = useState(false);
    const [suppressKeywordRefine, setSuppressKeywordRefine] = useState(false);
    const [shouldSuggest, setShouldSuggest] = useState(true);
    const [useCurrentLocationTriggered, setUseCurrentLocationTriggered] = useState(false);
    const locationSuggestionsState = useLocationSuggestions({
        location,
        focusedLocation,
        shouldSuggest
    });

    const {
        suggestions: locationSuggestions,
        setSuggestions: setLocationSuggestions
    } = locationSuggestionsState;

    const {
        highlightedIndex,
        setHighlightedIndex,
        moveDown: moveDownLocation,
        moveUp: moveUpLocation,
        reset: resetLocation
    } = useKeyboardHighlight(locationSuggestions);

    const showCurrentLocationOption = focusedLocation && location.trim() === "";

    // --- Search triggers & state ---
    const [searchTriggerKey, setSearchTriggerKey] = useState(0);
    const currentLocationUsedRef = useRef(false);
    const locationJustSelectedRef = useRef(false);
    const clickedOnSuggestionRef = useRef(false);
    const selectedFromDropdownRef = useRef(false);

    // --- Search history ---
    const {
        history: searchHistory,
        setHistory: setSearchHistory
    } = useSearchHistory();

    // --- Handles actual search execution ---
    const handleSearchSubmit = async () => {
        const trimmedKeyword = keyword.trim();
        const trimmedLocation = location.trim();

        if (!suppressKeywordRefine) {
            refine(trimmedKeyword);
        }

        if (trimmedLocation) {
            // Only geocode if latLng not already set (e.g. from dropdown or current location)
            if (!latLng) {
                const result = await geocodeCity(trimmedLocation);
                setLatLng(result || null);
            }
        } else {
            setLatLng(null);
        }

        // Refresh InstantSearch <Configure> props
        setSearchTriggerKey((prev) => prev + 1);
        setLocationTyping(false);
        setSuppressKeywordRefine(false);
    };

    // --- Handles keyword autocomplete selection ---
    const handleSuggestionClick = (text: string) => {
        setKeyword(text);
        refine(text);
        setShowKeywordSuggestions(false);
        resetKeyword();
    };

    // --- Handles selection of location from autocomplete or history ---
    const handleLocationSelect = (place: LocationSuggestion) => {
        clickedOnSuggestionRef.current = true;
        selectedFromDropdownRef.current = true;
        locationJustSelectedRef.current = true;

        setShouldSuggest(false);
        setLocation(place.placeName);
        setLatLng({ lat: place.lat, lng: place.lng });
        setLocationSuggestions([]);
        setFocusedLocation(false);

        if (!suppressKeywordRefine) {
            refine(keyword.trim());
        }

        setSearchTriggerKey((prev) => prev + 1);
        setSearchHistory((prev) => {
            const filtered = prev.filter((p) => p.placeName !== place.placeName);
            return [place, ...filtered].slice(0, 5);
        });

        setLocationTyping(false);
        setSuppressKeywordRefine(false);
    };

    // --- Handles location lookup based on browser geolocation ---
    const {
        locationName,
        latLng: geoLatLng,
        fetchCurrentLocation
    } = useGeolocation();

    useEffect(() => {
        if (useCurrentLocationTriggered && geoLatLng && locationName) {
            setLocation(locationName);
            setLatLng(geoLatLng);
            setLocationSuggestions([]);
            setFocusedLocation(false);

            locationJustSelectedRef.current = true;
            setUseCurrentLocationTriggered(false);

            if (currentLocationUsedRef.current) {
                setSearchTriggerKey((prev) => prev + 1);
                currentLocationUsedRef.current = false;
            }
        }
    }, [geoLatLng, locationName, useCurrentLocationTriggered]);

    const handleUseCurrentLocation = () => {
        currentLocationUsedRef.current = true;
        setUseCurrentLocationTriggered(true);
        fetchCurrentLocation();
    };

    const refineLocation = () => {
        setLatLng(null);
        setSearchTriggerKey((prev) => prev + 1); // re-triggers Configure
    };

    return (
        <>
            {!locationTyping && (
                <Configure
                key={`trigger-${searchTriggerKey}`}
                aroundLatLng={latLng ? `${latLng.lat}, ${latLng.lng}` : undefined}
                aroundRadius={latLng ? 50000 : undefined}
                filters={
                    latLng === null && location.trim()
                    ? "__invalid_geo:true"
                    : undefined
                }
                />
            )}

            <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center relative bg-white border border-gray-300 rounded-lg p-3"
            >
                <div className="flex items-center relative bg-gray-50 border border-gray-300 w-full rounded-full p-1">
                    <KeywordInput
                    keyword={keyword}
                    setKeyword={setKeyword}
                    keywordSuggestions={keywordSuggestions}
                    highlightedKeywordIndex={highlightedKeywordIndex}
                    setHighlightedKeywordIndex={setHighlightedKeywordIndex}
                    trendingKeywords={trendingKeywords}
                    highlightedTrendingIndex={highlightedTrendingIndex}
                    setHighlightedTrendingIndex={setHighlightedTrendingIndex}
                    handleSuggestionClick={handleSuggestionClick}
                    handleSearchSubmit={handleSearchSubmit}
                    refine={refine}
                    moveDown={moveDownKeyword}
                    moveUp={moveUpKeyword}
                    reset={resetKeyword}
                    moveDownTrending={moveDownTrending}
                    moveUpTrending={moveUpTrending}
                    resetTrending={resetTrending}
                    showKeywordSuggestions={showKeywordSuggestions}
                    setShowKeywordSuggestions={setShowKeywordSuggestions}
                    />

                    <div className="w-px h-6 bg-gray-200 mx-2" />

                    <LocationInput
                    location={location}
                    setLocation={setLocation}
                    locationSuggestions={locationSuggestions}
                    setLocationSuggestions={setLocationSuggestions}
                    searchHistory={searchHistory}
                    highlightedIndex={highlightedIndex}
                    setHighlightedIndex={setHighlightedIndex}
                    focusedLocation={focusedLocation}
                    setFocusedLocation={setFocusedLocation}
                    showCurrentLocationOption={showCurrentLocationOption}
                    handleLocationSelect={handleLocationSelect}
                    handleSearchSubmit={handleSearchSubmit}
                    handleUseCurrentLocation={handleUseCurrentLocation}
                    locationJustSelectedRef={locationJustSelectedRef}
                    clickedOnSuggestionRef={clickedOnSuggestionRef}
                    setSearchHistory={setSearchHistory}
                    setLatLng={setLatLng}
                    geoLoading={false} // geoLoading was unused in your original code
                    setShouldSuggest={setShouldSuggest}
                    setLocationTyping={setLocationTyping}
                    setSuppressKeywordRefine={setSuppressKeywordRefine}
                    refineLocation={refineLocation}
                    />

                    <SearchButton onClick={handleSearchSubmit} />
                </div>
            </motion.div>
        </>
    );
}