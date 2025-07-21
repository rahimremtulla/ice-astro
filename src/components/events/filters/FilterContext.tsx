// src/components/events/filters/FilterContext.tsx

/**
 * FilterContext
 * -------------
 * Define the shape of all filters used across the app.
 * Easily extend this type as you add location, keyword, eventType, etc.
 */

import React, { createContext, useContext, useState } from 'react';

export type FilterState = {
    dateRange?: {
        startDate: Date | null;
        endDate: Date | null;
    };

    // Future filters: location, type, keyword, etc.
    eventType?: string[];
};

// Initial default filter state (can be hydrated from localStorage or query params later)
const defaultFilters: FilterState = {
    dateRange: undefined,
};

// The context interface — exposes filter state and an updater function
export type FilterContextType = {
    filters: FilterState;
    updateFilters: (updated: Partial<FilterState>) => void;
};

// Create context — will be accessed via useFilterContext()
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Provides filter state to the app — wrap layout or page with this
export function FilterProvider({ children }: { children: React.ReactNode }) {
    const [filters, setFilters] = useState<FilterState>(defaultFilters);

    // Generic filter update function — merges new partial updates into current state
    const updateFilters = (updated: Partial<FilterState>) => {
        setFilters((prev) => ({ ...prev, ...updated }));
    };

    return (
        <FilterContext.Provider value={{ filters, updateFilters }}>
            {children}
        </FilterContext.Provider>
    );
}

// Custom hook for consuming the filter context safely
export function useFilterContext(): FilterContextType {
    const context = useContext(FilterContext);

    if (!context) {
        // Enforce usage within the provider tree — avoids null context errors
        throw new Error('useFilterContext must be used within a FilterProvider');
    }
    
    return context;
}