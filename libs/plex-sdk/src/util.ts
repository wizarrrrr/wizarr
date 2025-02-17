import type { Section } from "./library";

export interface MediaContainer<T> {
    MediaContainer: T;
}

export interface MetadataContainer<T extends { Metadata: any }> {
    MediaContainer: T;
}

export function rsplit(str: string, sep: string, maxsplit: number): string[] {
    const split = str.split(sep);
    return maxsplit ? [split.slice(0, -maxsplit).join(sep)].concat(split.slice(-maxsplit)) : split;
}

/**
 * Return the full agent identifier from a short identifier, name, or confirm full identifier.
 * @param section
 * @param agent
 */
export async function getAgentIdentifier(section: Section, agent: string) {
    const agents: any[] = [];
    for (const ag of await section.agents()) {
        const identifiers = [ag.identifier, ag.shortIdentifier, ag.name];
        if (identifiers.includes(agent)) {
            return ag.identifier;
        }

        agents.concat(identifiers);
    }

    throw new Error(`Couldnt find "${agent}" in agents list (${agents.join(", ")})`);
}

/** Simple tag helper for editing a object. */
export function tagHelper(tag: string, items: string[], locked = true, remove = false) {
    const data: Record<string, string | number> = {};
    if (remove) {
        const tagname = `${tag}[].tag.tag-`;
        data[tagname] = items.join(",");
    } else {
        for (let idx = 0; idx < items.length; idx++) {
            const item = items[idx];
            const tagname = `${tag}[${idx}].tag.tag`;
            data[tagname] = item;
        }
    }

    data[`${tag}.locked`] = locked ? 1 : 0;
    return data;
}

export function ltrim(x: string, characters: string[]) {
    let start = 0;
    while (characters.includes(x[start])) {
        start += 1;
    }

    const end = x.length - 1;
    return x.substr(start, end);
}

export function lowerFirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
