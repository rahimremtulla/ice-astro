// components/ui/PresetRadioButton.tsx

/**
 * PresetRadioButton
 * -----------------
 * A stylised radio button component used as an alternative to standard radio element.
 * Visually customised with a circular indicator and optional checkmark icon.
 * Designed for accessibility and seamless integration with filter UIs.
 */

import React from "react";

interface Props {
    label: string;
    checked: boolean;
    onChange: () => void;
}

export default function PresetRadioButton({ label, checked, onChange }: Props) {
    return (
        <label
        className="flex items-center gap-3 text-base cursor-pointer rounded-lg transition"
        >
            <input
            type="radio"
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
                    fill="currentColor"
                    >
                        <circle cx="12" cy="12" r="6" />
                    </svg>
                )}
            </div>
            <span className="select-none">{label}</span>
        </label>
    );
}