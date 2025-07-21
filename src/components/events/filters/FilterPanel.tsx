// src/components/events/filters/FilterPanel.tsx

// # Left-hand filter panel
import React from "react";
import { FilterProvider } from "./FilterContext";
import FilterSection from "./FilterSection";
import DateFilter from "./DateFilter";

export default function FilterPanel(): React.ReactElement {
    return (
        <FilterProvider>
            <aside className="space-y-4 overflow-visible">
                {/* Date Filter */}
                <DateFilter />

                {/* Event Type Filter */}
                <FilterSection title="Event Type">
                    <ul className="space-y-2">
                        {["Conference", "Lecture", "Networking", "Social", "Webinar"].map((label) => (
                        <li key={label}>
                            <label>
                                <input type="checkbox" className="mr-2" />
                                {label}
                            </label>
                        </li>
                    ))}
                    </ul>
                </FilterSection>

                {/* Format Filter */}
                <FilterSection title="Event Format">
                    <ul className="space-y-2">
                        {["In-person", "Online", "Hybrid"].map((label) => (
                        <li key={label}>
                            <label>
                                <input type="checkbox" className="mr-2" />
                                {label}
                            </label>
                        </li>
                        ))}
                    </ul>
                </FilterSection>

                {/* Cost Filter */}
                <FilterSection title="Cost">
                    <ul className="space-y-2">
                        <li><label><input type="checkbox" className="mr-2" /> Free</label></li>
                        <li><label><input type="checkbox" className="mr-2" /> Paid</label></li>
                    </ul>
                </FilterSection>
            </aside>
        </FilterProvider>
    );
}