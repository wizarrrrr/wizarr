import moment from "moment";

/**
 * isPast - Filter to determine if a date is in the past
 *
 * @param {string} value - The date or date string to calculate if it is in the past
 * @param {boolean} utc - Check against UTC or local
 * @returns The boolean result of the calculation
 */
function isPast(value: string | Date, utc: boolean = true): boolean {
    const date = utc ? moment.utc(value) : moment(value);
    return date.isBefore(moment());
}

export default isPast;
