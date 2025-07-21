// src/components/events/map/SkeletonPanel.tsx

/**
 * SkeletonPanel
 * ----------------------------------------------------------
 * A temporary placeholder panel shown while event route loading.
 * 
 * - Positioned absolutely in the top-right corner of the map/modal layout.
 * - Displays pulsing skeleton elements to indicate loading state.
 * - Includes a simulated heading bar and a list of six step-like placeholders.
 * 
 * Intended to mimic the layout of the final route/instruction panel
 * while asynchronous data (E.g. routing steps) is being fetched.
 */

export function SkeletonPanel() {
    return (
        <div className="directions-route-control absolute top-[75px] right-[20px] font-sans text-white w-80 rounded-lg shadow-lg z-[1000]">
            {/* Header */}
            <div className="directions-route-summary flex flex-row items-center space-x-3 rounded-t-lg">
                <div className="animate-pulse bg-white/20 w-1/4 h-5 rounded my-1"></div>
                <div className="animate-pulse bg-white/20 w-1/4 h-5 rounded my-1"></div>
            </div>
            {/* Directions List */}
            <div className="directions-instructions">
                <div className="directions-instructions-wrapper p-3">
                    <ol className="directions-steps flex flex-col gap-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <li key={i} className="flex items-center space-x-3 animate-pulse">
                                <div className="w-5 h-4 bg-white/10 rounded" />
                                <div className="flex-1 h-4 bg-white/10 rounded" />
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>        
    );
}