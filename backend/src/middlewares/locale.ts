import type { NextFunction, Request, Response } from 'express';

import { env } from '@config/index.js';

const normalizeLanguage = (value: string) => value.trim().toLowerCase();

const negotiateLocale = (header?: string | null) => {
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

export const localeResolver = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers['accept-language'];
  const negotiated = Array.isArray(header) ? header[0] : header;
  req.locale = negotiateLocale(negotiated);
  next();
};


