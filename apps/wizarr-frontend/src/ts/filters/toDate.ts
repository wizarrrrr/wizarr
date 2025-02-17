import moment from "moment";

/**
 * toDate - Filter to convert minutes to a date string from now
 *
 * @param {number} value - The minutes to convert to a UTC date string from now
 * @returns The date string
 */
function toDate(value: number | string): Date {
    return moment.utc().add(value, "minutes").toDate();
}

export default toDate;
