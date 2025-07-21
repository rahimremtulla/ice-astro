// src/components/events/filters/FilterSection.tsx

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

interface FilterSectionProps {
    title: string;
    children: ReactNode;
}

export default function FilterSection({ title, children }: FilterSectionProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-white rounded-2xl px-4 py-3 mb-4 border border-gray-200">
            <button
            type="button"
            className="w-full flex items-center justify-between text-left font-semibold text-gray-800"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            >
                <span>{title}</span>
                <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-3"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}