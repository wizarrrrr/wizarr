import { createGettext, type GetTextOptions } from "vue3-gettext";
import translations from "./language/translations.json";

console.log(`%cWizarr Server\n%cWizarr - MIT License - https://wizarr.org - https://github.com/wizarrrrr/wizarr`, "color: #FE4155; -webkit-text-stroke: 2px #FE4155; font-size: 72px; font-weight: bold;", "color: #00A2E8; font-size: 10px; font-weight: bold;");

// Available languages
const availableLanguages: GetTextOptions["availableLanguages"] = {
    vi: "Tiếng Việt",
    cs: "Čeština",
    da: "Dansk",
    de: "Deutsch",
    en: "English",
    es: "Español",
    fa: "فارسی",
    fr: "Français",
    he: "עברית",
    hr: "Hrvatski",
    hu: "Magyar",
    is: "Íslenska",
    it: "Italiano",
    lt: "Lietuvių",
    nl: "Nederlands",
    no: "Norsk",
    pl: "Polski",
    pt: "Português",
    ro: "Română",
    ru: "Русский",
    sv: "Svenska",
    zh_cn: "简体中文",
    zh_tw: "繁體中文",
};

// Get the preferred languages
const preferredLanguages = navigator.languages.map((language) => language.split("-")[0]);

// Find the first available language that matches the preferred languages
const language = preferredLanguages.find((language) => availableLanguages[language]) ?? "en";

// Log the preferred languages with colors blue
console.log("\x1b[34m%s\x1b[0m", "Available Languages:");
Object.keys(preferredLanguages).forEach((key) => {
    console.log("\x1b[36m%s\x1b[0m", `[${key}] ${availableLanguages[preferredLanguages[key as unknown as number]]} - ${preferredLanguages[key as unknown as number]}`);
});

console.log("\x1b[34m%s\x1b[0m", "Selected Language:");
console.log("\x1b[36m%s\x1b[0m", `[${language}] ${availableLanguages[language]}`);

// Create the gettext instance
const gettext = createGettext({
    availableLanguages,
    defaultLanguage: language,
    translations: translations,
    globalProperties: {
        gettext: ["$gettext", "__"],
        ngettext: ["$ngettext", "_n"],
        pgettext: ["$pgettext", "_x"],
        npgettext: ["$npgettext", "_xn"],
    },
});

export { language, availableLanguages };
export default gettext;
