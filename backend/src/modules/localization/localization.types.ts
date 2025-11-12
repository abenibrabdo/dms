export interface LocalizationQuery {
  language?: string;
  namespace?: string;
}

export interface LocalizationPayload {
  namespace: string;
  key: string;
  language: string;
  value: string;
  description?: string;
}


