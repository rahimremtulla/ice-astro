// src/components/events/map/LoadingPanel.tsx

/**
 * LoadingPanel
 * ----------------------------------------------------------
 * Displays a compact, visually centered loading indicator
 * over the map during route calculation.
 *
 * - Positioned absolutely near top-right corner.
 * - Shows a spinning loader alongside a status message.
 * - Styled with semi-transparent dark background for contrast.
 * - Used during route fetch operations to signal progress.
 */

export function LoadingPanel() {
    return (
        <div className="absolute top-[75px] right-[20px] w-80 p-4 bg-black/80 text-white z-[1000] rounded-lg flex items-center justify-center shadow-lg">
            <div className="animate-spin border-4 border-white border-t-transparent rounded-full w-6 h-6" />
            <span className="ml-3 text-sm font-medium">Calculating route…</span>
        </div>
    );
}