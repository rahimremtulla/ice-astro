// src/components/events/search/LocationInput.tsx

/**
 * LocationInput handles user entry of city or place name and provides:
 * - Autocomplete suggestions via geocoder
 * - Option to use current geolocation
 * - Recent location history
 * It supports both mouse and keyboard interaction and integrates with InstantSearch refinement.
 */

import { Clock, MapPin, X, LocateFixed } from "lucide-react";
import type { LocationSuggestion } from "../../../libs/geocode";
import { useState } from "react";

interface Props {
    location: string;
    setLocation: (val: string) => void;
    locationSuggestions: LocationSuggestion[];
    setLocationSuggestions: React.Dispatch<React.SetStateAction<LocationSuggestion[]>>;
    searchHistory: LocationSuggestion[];
    highlightedIndex: number | null;
    setHighlightedIndex: React.Dispatch<React.SetStateAction<number | null>>;
    focusedLocation: boolean;
    setFocusedLocation: (val: boolean) => void;
    showCurrentLocationOption: boolean;
    handleLocationSelect: (place: LocationSuggestion) => void;
    handleSearchSubmit: () => void;
    handleUseCurrentLocation: () => void;
    locationJustSelectedRef: React.MutableRefObject<boolean>;
    clickedOnSuggestionRef: React.MutableRefObject<boolean>;
    setSearchHistory: React.Dispatch<React.SetStateAction<LocationSuggestion[]>>;
    setLatLng: (coords: { lat: number; lng: number } | null) => void;
    geoLoading: boolean;
    setShouldSuggest: React.Dispatch<React.SetStateAction<boolean>>;
    setLocationTyping: React.Dispatch<React.SetStateAction<boolean>>;
    setSuppressKeywordRefine: React.Dispatch<React.SetStateAction<boolean>>;
    refineLocation: () => void;
}

export default function LocationInput({
    location,
    setLocation,
    locationSuggestions,
    setLocationSuggestions,
    searchHistory,
    highlightedIndex,
    setHighlightedIndex,
    focusedLocation,
    setFocusedLocation,
    showCurrentLocationOption,
    handleLocationSelect,
    handleSearchSubmit,
    handleUseCurrentLocation,
    locationJustSelectedRef,
    clickedOnSuggestionRef,
    setSearchHistory,
    setLatLng,
    geoLoading,
    setShouldSuggest,
    setLocationTyping,
    setSuppressKeywordRefine,
    refineLocation
}: Props) {
    const [isFocused, setIsFocused] = useState(false);

    const showDropdown =
    isFocused &&
    (locationSuggestions.length > 0 || searchHistory.length > 0 || showCurrentLocationOption);

    const handleRemoveSearchItem = (index: number) => {
        setSearchHistory(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="relative flex-1">
            <label htmlFor="location" className="sr-only">
                Location
            </label>

            <div className="flex items-center pl-3">
                <MapPin size={18} className="text-gray-400 mr-1" />

                {/* Location input */}
                <input
                id="location"
                type="text"
                placeholder="Location (E.g. London)"
                value={location}
                onChange={(e) => {
                    locationJustSelectedRef.current = false;
                    setLocationSuggestions([]);
                    setShouldSuggest(true);
                    setLocation(e.target.value);
                    setFocusedLocation(true);
                    setIsFocused(true);
                    setLocationTyping(true);
                    setSuppressKeywordRefine(true);
                    setLatLng(null); // Clear stale coordinates
                }}
                onFocus={() => {
                    setFocusedLocation(true);
                    setIsFocused(true);
                }}
                onBlur={() => {
                    setTimeout(() => {
                        setFocusedLocation(false);
                        setIsFocused(false);
                        setHighlightedIndex(null);
                    }, 200); // Delay blur to allow click selection
                }}
                onKeyDown={(e) => {
                    const items = locationSuggestions.length > 0 ? locationSuggestions : searchHistory;

                    if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setHighlightedIndex(prev =>
                        prev === null || prev >= items.length - 1 ? 0 : prev + 1
                    );
                }

                if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setHighlightedIndex(prev =>
                        prev === null || prev <= 0 ? items.length - 1 : prev - 1
                    );
                }

                if (e.key === "Enter") {
                    e.preventDefault();
                    if (highlightedIndex !== null) {
                        const selected = items[highlightedIndex];
                        clickedOnSuggestionRef.current = true;
                        locationJustSelectedRef.current = true;
                        handleLocationSelect(selected);
                    } else if (location.trim() !== "") {
                        handleSearchSubmit();
                    }
                    setFocusedLocation(false);
                    setIsFocused(false);
                    setHighlightedIndex(null);
                }

                if (e.key === "Escape") {
                    setFocusedLocation(false);
                    setIsFocused(false);
                    setHighlightedIndex(null);
                }
                }}
                className="w-full py-2 pr-8 bg-transparent placeholder-gray-400 text-sm focus:outline-none"
                />

                {/* Clear location button */}
                {location && (
                    <button
                        onClick={() => {
                            setLocation("");
                            setLocationSuggestions([]);
                            setLatLng(null);
                            setHighlightedIndex(null);
                            refineLocation();
                        }}
                        className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                )}

                {/* Location spinner */}
                    {geoLoading && (
                    <div className="absolute right-10 top-2">
                        <svg className="animate-spin h-4 w-4 text-blue-500" viewBox="0 0 24 24">
                            <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            />
                            <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* Location dropdown */}
            {showDropdown && (
                <ul className="absolute z-10 bg-white mt-2 w-full border border-gray-300 rounded-md shadow-sm">
                    {/* Use current location */}
                    {showCurrentLocationOption && (
                        <li
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={handleUseCurrentLocation}
                        >
                            <LocateFixed size={16} className="text-blue-500" />
                            {geoLoading ? "Locating..." : "Use my current location"}
                        </li>
                    )}

                    {/* Geocoder suggestions */}
                    {locationSuggestions.map((item, index) => (
                        <li
                        key={`suggestion-${item.placeName}-${index}`}
                        className={`flex items-start gap-2 px-4 py-2 text-gray-600 cursor-pointer ${
                            index === highlightedIndex ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                        }`}
                        onMouseDown={() => {
                            clickedOnSuggestionRef.current = true;
                            handleLocationSelect(item);
                        }}
                        >
                            <MapPin size={16} className="text-gray-500 mt-1" />
                            <div>
                                <div>{item.placeName}</div>
                                {item.context && <div className="text-xs text-gray-400">{item.context}</div>}
                            </div>
                        </li>
                    ))}

                    {/* Location history (if no suggestions) */}
                    {locationSuggestions.length === 0 && searchHistory.length > 0 && (
                        <>
                            <li className="flex justify-between items-center px-4 pt-2 pb-1 text-gray-500 text-sm font-semibold">
                                <span>Recent searches</span>
                                <button
                                onMouseDown={() => setSearchHistory([])}
                                className="text-gray-400 hover:text-red-500 text-xs cursor-pointer"
                                >
                                    Clear all
                                </button>
                            </li>

                            {searchHistory.map((item, index) => (
                                <li
                                key={`history-${item.placeName}-${index}`}
                                className={`flex justify-between items-center px-4 py-2 text-gray-600 ${
                                    index === highlightedIndex ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                                }`}
                                >
                                    <div
                                    className="flex items-start gap-2 cursor-pointer"
                                    onMouseDown={() => {
                                    clickedOnSuggestionRef.current = true;
                                    handleLocationSelect(item);
                                    }}
                                    >
                                        <Clock size={16} className="text-gray-500 mt-1" />
                                        <div>
                                            <div>{item.placeName}</div>
                                            <div className="text-xs text-gray-400">Recent search</div>
                                        </div>
                                    </div>

                                    <button
                                    onMouseDown={(e) => {
                                    e.stopPropagation();
                                    handleRemoveSearchItem(index);
                                    }}
                                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                                    >
                                        <X size={14} />
                                    </button>
                                </li>
                            ))}
                        </>
                    )}
                </ul>
            )}
        </div>
    );
}