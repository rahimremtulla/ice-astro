// src/utils/dateFormatter.ts

/**
 * Date formatting utilities
 * -------------------------
 * Provides helpers for consistent rendering of dates, times, and timezone labels.
 * Used to present event metadata cleanly in UI components like EventCard.
 */

/**
 * formatDate
 * ----------
 * Converts a Date object into a British-style full date string.
 * E.g. "18 July 2025"
 */
export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * formatTime
 * ----------
 * Returns a time string in "HH:MM" 24-hour format.
 * E.g. "14:30"
 */
export function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * getTimezoneLabel
 * ----------------
 * Approximates the timezone for a given date based on UK daylight saving.
 * Returns either:
 * - "BST (GMT+1)" for British Summer Time
 * - "GMT" for standard time
 *
 * DST starts last Sunday in March, ends last Sunday in October.
 */
export function getTimezoneLabel(date: Date): string {
    const y = date.getFullYear();
    const lastMarchSun = new Date(Date.UTC(y, 2, 31));

    lastMarchSun.setUTCDate(lastMarchSun.getUTCDate() - lastMarchSun.getUTCDay());

    const lastOctSun = new Date(Date.UTC(y, 9, 31));

    lastOctSun.setUTCDate(lastOctSun.getUTCDate() - lastOctSun.getUTCDay());

    return date >= lastMarchSun && date < lastOctSun ? 'BST (GMT+1)' : 'GMT';
}

/**
 * formatEventDate
 * ---------------
 * Formats event start and end timestamps into readable display strings.
 *
 * If both dates fall on the same day:
 *   → "Date: 18 July 2025, 09:00 - 16:00 GMT"
 *
 * If they span multiple days:
 *   → {
 *        start: "Start: 18 July 2025, 09:00 GMT",
 *        end: "End: 19 July 2025, 16:00 GMT"
 *      }
 */
export function formatEventDate(
    startStr: string,
    endStr: string
): string | { start: string; end: string } {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const tz = getTimezoneLabel(start);
    const isSameDay = start.toDateString() === end.toDateString();

    if (isSameDay) {
        return `Date: ${formatDate(start)}, ${formatTime(start)} - ${formatTime(end)} ${tz}`;
    }

    return {
        start: `Start: ${formatDate(start)}, ${formatTime(start)} ${tz}`,
        end: `End: ${formatDate(end)}, ${formatTime(end)} ${tz}`,
    };
}