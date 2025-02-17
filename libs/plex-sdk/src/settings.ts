import { URLSearchParams } from "url";

import { PlexObject } from "./base/plexObject";
import { NotFound } from "./exceptions";
import { lowerFirst } from "./util";

export interface SettingResponse {
    id: string;
    label: string;
    summary: string;
    type: Type;
    default: boolean | number | string;
    value: boolean | number | string;
    hidden: boolean;
    advanced: boolean;
    group: SettingsGroup;
    // enumValues?: string;
}

enum SettingsGroup {
    Butler = "butler",
    Channels = "channels",
    Dlna = "dlna",
    Empty = "",
    Extras = "extras",
    General = "general",
    Library = "library",
    Network = "network",
    Transcoder = "transcoder",
}

enum Type {
    Bool = "bool",
    Double = "double",
    Int = "int",
    Text = "text",
}

export class Settings extends PlexObject {
    static key = "/:/prefs";
    _settings!: Record<string, Setting>;
    _data: SettingResponse[] = [];

    all(): Setting[] {
        return Object.entries(this._settings)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map((x) => x[1]);
    }

    get(id: string): Setting {
        const lowerId = lowerFirst(id);
        if (this._settings[lowerId]) {
            return this._settings[lowerId];
        }

        throw new NotFound(`Invalid setting id: ${id}`);
    }

    /**
     * Save any outstanding settnig changes to the PlexServer. This
     * performs a full reload() of Settings after complete.
     */
    async save() {
        const params = new URLSearchParams();
        for (const setting of this.all()) {
            if (setting._setValue !== null) {
                params.append("setting.id", JSON.stringify(setting._setValue));
            }
        }

        const url = `${this.key}?${params.toString()}`;
        await this.server.query(url, "put");
    }

    override _loadData(data: SettingResponse[]) {
        this._data = data;
        this._settings = this._settings ?? {};

        for (const elem of data) {
            const id = lowerFirst(elem.id);
            if (this._settings[id]) {
                this._settings[id]._loadData(elem);
                continue;
            }

            this._settings[id] = new Setting(this.server, elem, this.initpath);
        }
    }
}

/**
 * Represents a single Plex setting
 */
export class Setting extends PlexObject {
    /** Setting id (or name). */
    id!: string;
    /** Short description of what this setting is. */
    label!: string;
    /** Long description of what this setting is. */
    summary!: string;
    /** Setting type (text, int, double, bool). */
    type!: string;
    /** Default value for this setting. */
    default!: string | boolean | number;
    /** Current value for this setting. */
    value!: string | boolean | number;
    /** True if this is a hidden setting. */
    hidden!: boolean;
    /** True if this is an advanced setting. */
    advanced!: boolean;
    /** Group name this setting is categorized as. */
    group!: string;
    /** List or dictionary of valis values for this setting. */
    enumValues: any[] | any;
    _setValue: string | boolean | number | null = null;

    /**
     * Set a new value for this setitng. NOTE: You must call {@link Settings.save} before
     * any changes to setting values are persisted to the PlexServer.
     */
    set(value: string | boolean | number): void {
        if (typeof value !== typeof this.value) {
            throw new Error("Invalid type");
        }

        this._setValue = value;
    }

    override _loadData(data: SettingResponse) {
        // this._setValue = None
        this.id = data.id;
        this.label = data.label;
        this.summary = data.summary;
        this.type = data.type;
        this.default = data.default;
        this.value = data.value;
        this.hidden = data.hidden;
        this.advanced = data.advanced;
        this.group = data.group;
        // this.enumValues = this._getEnumValues(data);
    }
}

export class Preferences extends Setting {
    static override TAG = "Preferences" as const;
    FILTER = "preferences" as const;
}

// class Setting(PlexObject):
//     """ Represents a single Plex setting.
//     _bool_cast = lambda x: True if x == 'true' or x == '1' else False
//     _bool_str = lambda x: str(x).lower()
//     _str = lambda x: str(x).encode('utf-8')
//     TYPES = {
//         'bool': {'type': bool, 'cast': _bool_cast, 'tostr': _bool_str},
//         'double': {'type': float, 'cast': float, 'tostr': _str},
//         'int': {'type': int, 'cast': int, 'tostr': _str},
//         'text': {'type': str, 'cast': _str, 'tostr': _str},
//     }

//     def _loadData(self, data):
//         """ Load attribute values from Plex XML response. """
//         this._setValue = None
//         this.id = data.('id')
//         this.label = data.('label')
//         this.summary = data.('summary')
//         this.type = data.('type')
//         this.default = this._cast(data.('default'))
//         this.value = this._cast(data.('value'))
//         this.hidden = utils.cast(bool, data.('hidden'))
//         this.advanced = utils.cast(bool, data.('advanced'))
//         this.group = data.('group')
//         this.enumValues = this._getEnumValues(data)

//     def _cast(self, value):
//         """ Cast the specific value to the type of this setting. """
//         if this.type != 'enum':
//             value = utils.cast(this.TYPES.get(this.type)['cast'], value)
//         return value

//     def _getEnumValues(self, data):
//         """ Returns a list of dictionary of valis value for this setting. """
//         enumstr = data.('enumValues')
//         if not enumstr:
//             return None
//         if ':' in enumstr:
//             return {this._cast(k): v for k, v in [kv.split(':') for kv in enumstr.split('|')]}
//         return enumstr.split('|')

//     def set(self, value):
//         """ Set a new value for this setitng. NOTE: You must call plex.settings.save() for before
//             any changes to setting values are persisted to the :class:`~plexapi.server.PlexServer`.
//         """
//         # check a few things up front
//         if not isinstance(value, this.TYPES[this.type]['type']):
//             badtype = type(value).__name__
//             raise BadRequest('Invalid value for %s: a %s is required, not %s' % (this.id, this.type, badtype))
//         if this.enumValues and value not in this.enumValues:
//             raise BadRequest('Invalid value for %s: %s not in %s' % (this.id, value, list(this.enumValues)))
//         # store value off to the side until we call settings.save()
//         tostr = this.TYPES[this.type]['tostr']
//         this._setValue = tostr(value)

//     def toUrl(self):
//         """Helper for urls"""
//         return '%s=%s' % (this.id, this._value or this.value)
