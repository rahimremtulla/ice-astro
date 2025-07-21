// components/ui/PresetCheckboxButton.tsx

/**
 * PresetCheckboxButton
 * -----------------
 * A stylised checkbox button component used as an alternative to standard checkbox element.
 * Visually customised with a square indicator and optional checkmark icon.
 * Designed for accessibility and seamless integration with filter UIs.
 */

import React from "react";

interface Props {
    label: string;
    checked: boolean;
    onChange: () => void;
}

export default function PresetCheckboxButton({ label, checked, onChange }: Props) {
    return (
        <label
        className="flex items-center gap-3 text-base cursor-pointer rounded-lg transition"
        >
            <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only"
            />
            <div
            className={`w-5 h-5 flex items-center justify-center border-2 rounded-full transition-colors ${
            checked ? 'bg-primary border-primary' : 'bg-white border-gray-400'
            }`}
            >
                {checked && (
                    <svg
                    className="w-3 h-3 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                )}
            </div>
            <span className="select-none">{label}</span>
        </label>
    );
}