import { useFilterContext } from "./FilterContext";
import { useRefinementList } from "react-instantsearch";

export default function StaticEventTypeList() {
  const { filters, updateFilters } = useFilterContext();
  const { items } = useRefinementList({ attribute: 'eventType' });

  // Use fallback list if nothing selected yet
  const selected = filters.eventType || [];

  const handleToggle = (label: string) => {
    const updated = selected.includes(label)
      ? selected.filter((l) => l !== label)
      : [...selected, label];

    updateFilters({ eventType: updated });
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Event Type</h3>
      <ul>
        {items.map(({ label, count }) => (
          <li key={label} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(label)}
              onChange={() => handleToggle(label)}
              className="cursor-pointer"
            />
            <label className="text-sm text-gray-600 cursor-pointer">
              {label} <span className="text-gray-400">({count})</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}