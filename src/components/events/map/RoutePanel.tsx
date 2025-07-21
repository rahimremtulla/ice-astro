// src/components/events/map/RoutePanel.tsx

import React from "react";

type Step = {
  maneuver: {
    instruction: string;
  };
};

type Props = {
  steps: Step[];
};

export default function RoutePanel({ steps }: Props) {
  if (!steps?.length) return null;

  return (
    <aside className="p-4 w-full sm:w-80 border-l border-gray-200 bg-white overflow-y-auto">
      <h2 className="text-lg font-bold mb-3 text-gray-800">Directions</h2>
      <ul className="space-y-3 text-sm text-gray-700">
        {steps.map((step, index) => (
          <li key={index} className="border-l-2 pl-3 border-blue-500">
            {step.maneuver.instruction}
          </li>
        ))}
      </ul>
    </aside>
  );
}