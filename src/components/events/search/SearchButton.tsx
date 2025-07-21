// src/components/events/search/SearchButton.tsx

/**
 * SearchButton component triggers manual search submission.
 * It displays a circular search icon button, styled to match primary theme.
 * Used alongside KeywordInput and LocationInput to activate search.
 */

import { Search } from "lucide-react";

interface Props {
    onClick: () => void; // Callback to trigger search logic
}

export default function SearchButton({ onClick }: Props) {
    return (
        <button
        onClick={onClick}
        aria-label="Search"
        title="Search"
        className="bg-primary hover:bg-primary-700 text-white p-3 rounded-full cursor-pointer ml-2 transition-opacity"
        >
            <Search size={16} />
        </button>
    );
}