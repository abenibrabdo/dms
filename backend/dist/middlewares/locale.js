import { env } from '@config/index.js';
const normalizeLanguage = (value) => value.trim().toLowerCase();
const negotiateLocale = (header) => {
    if (!header) {
        return env.localization.defaultLocale;
    }
    const supported = new Set(env.localization.supportedLocales.map(normalizeLanguage));
    const segments = header.split(',').map((part) => part.split(';')[0]);
    for (const segment of segments) {
        const normalized = normalizeLanguage(segment);
        if (supported.has(normalized)) {
            return normalized;
        }
        const base = normalized.split('-')[0];
        if (supported.has(base)) {
            return base;
        }
    }
    return env.localization.defaultLocale;
};
export const localeResolver = (req, _res, next) => {
    const header = req.headers['accept-language'];
    const negotiated = Array.isArray(header) ? header[0] : header;
    req.locale = negotiateLocale(negotiated);
    next();
};
