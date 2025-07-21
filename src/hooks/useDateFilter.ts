// hooks/useDateFilter.ts

/**
 * useDateFilter
 * -------------
 * Custom React hook for managing date-based filtering logic in search UIs.
 * Supports preset filters (Today, Tomorrow, This Week) and custom date ranges.
 * Builds Algolia-compatible filter queries and syncs with global filter context.
 * Handles calendar visibility, state transitions, and query persistence.
 */

import { useState, useMemo } from 'react';
import { addDays } from 'date-fns';
import type { FilterState } from '../components/events/filters/FilterContext';
import { useFilterContext } from '../components/events/filters/FilterContext';

export const getDefaultRange = () => ({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
});

function buildDateFilterQuery(
    preset: string | null,
    isApplied: boolean,
    filters: FilterState,
    fallbackRange?: FilterState['dateRange']
): string | undefined {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getBounds = (start: Date, span: number) => {
        const end = addDays(start, span);
        return `startTimestamp >= ${start.getTime()} AND startTimestamp < ${end.getTime()}`;
    };

    if (preset === 'today') return getBounds(today, 1);
    if (preset === 'tomorrow') return getBounds(addDays(today, 1), 1);
    if (preset === 'week') return getBounds(today, 7);

    const range = isApplied
    ? filters.dateRange
    : fallbackRange ?? filters.dateRange;

    if (preset === 'custom' && range?.startDate && range.endDate) {
        const start = new Date(range.startDate);
        const end = new Date(range.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        const nextDay = addDays(end, 1);
        return `startTimestamp >= ${start.getTime()} AND startTimestamp < ${nextDay.getTime()}`;
    }

    return undefined;
}

export function useDateFilter() {
    const { filters, updateFilters } = useFilterContext();

    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
    const [customRange, setCustomRange] = useState(getDefaultRange());
    const [isApplied, setIsApplied] = useState(false);
    const [appliedRange, setAppliedRange] = useState(filters.dateRange);
    const [showCalendar, setShowCalendar] = useState(false);
    const [lastValidQuery, setLastValidQuery] = useState<string | undefined>();

    const filterQuery = useMemo(() => {
        const query = buildDateFilterQuery(
            selectedPreset,
            isApplied,
            filters,
            appliedRange
        );
        return query ?? lastValidQuery;
    }, [selectedPreset, isApplied, filters, appliedRange, lastValidQuery]);

    // Track latest valid query
    useMemo(() => {
        const query = buildDateFilterQuery(
            selectedPreset,
            isApplied,
            filters,
            appliedRange
        );
        
        if (query) setLastValidQuery(query);
    }, [selectedPreset, isApplied, filters, appliedRange]);

    const handlePresetSelect = (value: string) => {
        setSelectedPreset(value);
        setIsApplied(false);

        if (['today', 'tomorrow', 'week'].includes(value)) {
            updateFilters({ dateRange: undefined });
            setShowCalendar(false);
        } else {
            setShowCalendar(true);
        }
    };

    const handleApply = () => {
        const newRange = {
            startDate: customRange.startDate,
            endDate: customRange.endDate,
        };
        updateFilters({ dateRange: newRange });
        setAppliedRange(newRange);
        setIsApplied(true);
        setShowCalendar(false);
    };

    const handleClear = () => {
        setCustomRange(getDefaultRange());
        setIsApplied(false);
        setSelectedPreset(null);
        updateFilters({ dateRange: undefined });
        setAppliedRange(undefined);
        setShowCalendar(false);
        setLastValidQuery('');
    };

    const closeCalendar = () => setShowCalendar(false);
    const openCalendar = () => setShowCalendar(true);

    return {
        selectedPreset,
        customRange,
        isApplied,
        filterQuery,
        handlePresetSelect,
        handleApply,
        handleClear,
        setCustomRange,
        showCalendar,
        openCalendar,
        closeCalendar
    };
}