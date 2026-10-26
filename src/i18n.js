import en from "./locales/en.json";
import es from "./locales/es.json";

import { createI18n } from "vue-i18n";

/**
 * Shared internationalization service used across presentation modules.
 */

const savedLanguage = localStorage.getItem("kinemo-language");

const i18n = createI18n({
    legacy: false,

    // English by default.
    // If the user previously selected ES, keep that preference.
    locale: savedLanguage || "en",

    fallbackLocale: "en",

    messages: {
        en,
        es
    }
});

export default i18n;