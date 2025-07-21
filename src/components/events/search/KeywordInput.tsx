// src/components/events/search/KeywordInput.tsx

/**
 * KeywordInput component handles free-text search input and suggestion display.
 * It shows trending keywords when the input is empty, and displays autocomplete
 * results as the user types. Selection can be made by mouse or keyboard.
 */

import { Search, TrendingUp, X } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";

interface Props {
    keyword: string;
    setKeyword: (val: string) => void;
    keywordSuggestions: string[];
    trendingKeywords: string[];
    highlightedKeywordIndex: number | null;
    highlightedTrendingIndex: number | null;
    handleSuggestionClick: (val: string) => void;
    handleSearchSubmit: () => void;
    refine: (val: string) => void;
    moveDown: () => void;
    moveUp: () => void;
    reset: () => void;
    moveDownTrending: () => void;
    moveUpTrending: () => void;
    resetTrending: () => void;
    setHighlightedKeywordIndex: React.Dispatch<React.SetStateAction<number | null>>;
    setHighlightedTrendingIndex: React.Dispatch<React.SetStateAction<number | null>>;
    showKeywordSuggestions: boolean;
    setShowKeywordSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
}

const KeywordInput: FC<Props> = ({
    keyword,
    setKeyword,
    keywordSuggestions,
    trendingKeywords,
    highlightedKeywordIndex,
    highlightedTrendingIndex,
    handleSuggestionClick,
    handleSearchSubmit,
    refine,
    moveDown,
    moveUp,
    reset,
    moveDownTrending,
    moveUpTrending,
    resetTrending,
    showKeywordSuggestions,
    setShowKeywordSuggestions
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const isEmpty = keyword.trim() === "";

    return (
        <div className="relative flex-1">
            <label htmlFor="keyword" className="sr-only">Keyword</label>
            <div className="flex items-center pl-3">
                <Search size={18} className="text-gray-400 mr-1" />

                {/* Main keyword input */}
                <input
                id="keyword"
                type="text"
                placeholder="Search events"
                value={keyword}
                onChange={(e) => {
                    setShowKeywordSuggestions(true);
                    setKeyword(e.target.value);
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    // Delay blur reset to allow mouse selection
                    setTimeout(() => {
                        setIsFocused(false);
                        reset();
                        resetTrending();
                    }, 200);
                }}
                onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                        e.preventDefault();
                        isEmpty ? moveDownTrending() : moveDown();
                    }

                if (e.key === "ArrowUp") {
                    e.preventDefault();
                    isEmpty ? moveUpTrending() : moveUp();
                }

                if (e.key === "Escape") {
                    reset();
                    resetTrending();
                }

                if (e.key === "Enter") {
                    const selected = isEmpty
                    ? trendingKeywords[highlightedTrendingIndex ?? 0]
                    : keywordSuggestions[highlightedKeywordIndex ?? 0];

                    if (selected) {
                        handleSuggestionClick(selected);
                    } else {
                        handleSearchSubmit();
                    }
                }
                }}
                className="w-full py-2 pr-8 bg-transparent placeholder-gray-400 text-sm focus:outline-none"
                />

                {/* Clear button for input */}
                {keyword && (
                    <button
                        onClick={() => {
                            setKeyword("");
                            refine("");
                        }}
                        className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Trending suggestions when input is empty and focused */}
            {isFocused && isEmpty && trendingKeywords.length > 0 && (
                <div className="absolute z-10 bg-white mt-2 w-full border border-gray-300 rounded-md shadow-sm">
                    <div className="px-4 py-2 text-gray-700 font-semibold">Trending searches</div>
                    <ul>
                        {trendingKeywords.map((item, index) => (
                            <li
                            key={index}
                            className={`flex items-center gap-2 px-4 py-2 text-gray-600 cursor-pointer ${
                            index === highlightedTrendingIndex ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                            }`}
                            onMouseDown={() => handleSuggestionClick(item)}
                            >
                                <TrendingUp size={16} className="text-black" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 📄 Autocomplete keyword suggestions */}
            {showKeywordSuggestions && !isEmpty && keywordSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white mt-2 w-full border border-gray-300 rounded-md shadow-sm">
                    {keywordSuggestions.map((title, index) => {
                        const matchIndex = title.toLowerCase().indexOf(keyword.toLowerCase());
                        const beforeMatch = title.slice(0, matchIndex);
                        const matchText = title.slice(matchIndex, matchIndex + keyword.length);
                        const afterMatch = title.slice(matchIndex + keyword.length);

                        return (
                            <li
                            key={index}
                            className={`px-4 py-2 text-gray-600 cursor-pointer ${
                            index === highlightedKeywordIndex ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                            }`}
                            onMouseDown={() => handleSuggestionClick(title)}
                            >
                                {matchIndex >= 0 ? (
                                    <>
                                        {beforeMatch}
                                            <span className="font-semibold text-black">{matchText}</span>
                                        {afterMatch}
                                    </>
                                ) : (
                                    title
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default KeywordInput;