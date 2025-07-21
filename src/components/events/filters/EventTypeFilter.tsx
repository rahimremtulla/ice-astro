// src/components/events/filters/EventTypeFilter.tsx

import React from "react";
import { useFilterContext } from "./FilterContext";

const EVENT_TYPES = [
  "Conference",
  "Lecture",
  "Networking",
  "Social",
  "Webinar"
]; // Dynamically fetch this from Algolia later if needed

export default function EventTypeFilter(): React.ReactElement {
  const { filters, updateFilters } = useFilterContext();
  const selected = filters.eventType || [];

  const toggleType = (type: string) => {
    const isSelected = selected.includes(type);
    const next = isSelected
      ? selected.filter((t) => t !== type)
      : [...selected, type];

    updateFilters({ eventType: next });
  };

  return (
    <div className="space-y-2">
      {EVENT_TYPES.map((type) => (
        <label key={type} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={selected.includes(type)}
            onChange={() => toggleType(type)}
            className="form-checkbox"
          />
          {type}
        </label>
      ))}
    </div>
  );
}