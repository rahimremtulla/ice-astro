// components/events/filters/DateFilter.tsx

/**
 * DateFilter
 * ----------
 * A reusable date filter component for Algolia-powered search interfaces.
 * Supports preset options (Today, Tomorrow, This Week, Custom) and a custom date range selector.
 * Integrates with react-instantsearch and react-date-range for filtering and calendar UI.
 * Uses a custom hook (useDateFilter) to manage state and logic.
 */

import React, { useRef } from 'react';
import { Configure } from 'react-instantsearch';
import { DateRange } from 'react-date-range';
import { addYears, subYears } from 'date-fns';
import { enGB } from 'date-fns/locale';
import useOnClickOutside from '../../../hooks/useOnClickOutside';

import FilterSection from './FilterSection';
import { useDateFilter } from '../../../hooks/useDateFilter';
import PresetRadioButton from '../../ui/PresetRadioButton';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../../../styles/calendar.css';

export default function DateFilter() {
    const {
        selectedPreset,
        customRange,
        filterQuery,
        handlePresetSelect,
        handleApply,
        handleClear,
        setCustomRange,
        showCalendar,
        closeCalendar
    } = useDateFilter();

    const calendarRef = useRef<HTMLDivElement | null>(null);


    useOnClickOutside(calendarRef, () => {
        if (selectedPreset === 'custom' && showCalendar) {
            closeCalendar();
        }
    });


    return (
        <FilterSection title="Date">
            <ul className="space-y-2">
                {/* Custom radio buttons */}
                {['today', 'tomorrow', 'week', 'custom'].map((value) => {
                    const label =
                    value === 'week'
                    ? 'This week'
                    : value === 'custom'
                    ? 'Custom dates'
                    : value.charAt(0).toUpperCase() + value.slice(1);

                    return (
                        <li key={value}>
                        <PresetRadioButton
                        label={label}
                        checked={selectedPreset === value}
                        onChange={() => handlePresetSelect(value)}
                        />
                        </li>
                    );
                })}
            </ul>

            {filterQuery !== undefined && (
                <Configure filters={filterQuery} />
            )}

            {selectedPreset === 'custom' && showCalendar && (
                <div
                ref={calendarRef}
                className="absolute z-50 mt-2 shadow-lg bg-white rounded-lg overflow-hidden"
                >
                    <div className="flex flex-col">
                        <DateRange
                        ranges={[customRange]}
                        onChange={({ selection }) => setCustomRange(selection)}
                        dateDisplayFormat="dd MMMM yyyy"
                        moveRangeOnFirstSelection={false}
                        editableDateInputs={false}
                        minDate={subYears(new Date(), 2)}
                        maxDate={addYears(new Date(), 2)}
                        firstDayOfWeek={1}
                        locale={enGB}
                        />
                        <div className="flex justify-between px-2 py-2 bg-gray-100">
                            <button
                            onClick={handleClear}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-full cursor-pointer"
                            >
                                Clear
                            </button>
                            <button
                            onClick={handleApply}
                            className="bg-primary hover:bg-primary-700 text-white text-sm px-4 py-2 rounded-full cursor-pointer"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </FilterSection>
    );
}