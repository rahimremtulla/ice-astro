import { useState, useMemo } from "react";
import { useFilterContext } from "../components/events/filters/FilterContext";

export function useEventTypeFilter() {
  const { filters, updateFilters } = useFilterContext();
  const [selectedTypes, setSelectedTypes] = useState<string[]>(filters.eventType ?? []);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => {
      const updated = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];
      updateFilters({ eventType: updated });
      return updated;
    });
  };

  const clearTypes = () => {
    setSelectedTypes([]);
    updateFilters({ eventType: [] });
  };

  const eventTypeQuery = useMemo(() => {
    if (selectedTypes.length === 0) return undefined;
    return selectedTypes.map((type) => `eventType:"${type}"`).join(" OR ");
  }, [selectedTypes]);

  return { selectedTypes, toggleType, clearTypes, eventTypeQuery };
}