export interface Language {
  code: string; // alpha3code (ISO 639-2). We do not rename it for backward compatibility
  alpha2Code: string;
  label: string;
}
