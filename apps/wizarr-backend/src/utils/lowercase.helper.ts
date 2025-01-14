/**
 * Converts a string to lowercase.
 * @param str The string to convert.
 * @returns The converted string.
 */
export function toLowerCase<T>(str: T): T {
    if (typeof str !== "string") {
        return str;
    }

    return str.toLowerCase() as unknown as T;
}
