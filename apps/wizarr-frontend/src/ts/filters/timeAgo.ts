import { formatTimeAgo } from "@vueuse/core";
import moment from "moment";

/**
 * timeAgo - Converts a date to a time ago string (e.g., "5 minutes ago").
 *
 * @param {string | Date} value - The date or date string to convert.
 * @param {boolean} [utc=true] - Whether the input date is in UTC.
 * @returns {string} The formatted time ago string.
 */
function timeAgo(value: string | Date, utc: boolean = true): string {
    const date = utc ? moment.utc(value).toDate() : moment(value).toDate();
    return formatTimeAgo(date, { showSecond: true });
}

export default timeAgo;
