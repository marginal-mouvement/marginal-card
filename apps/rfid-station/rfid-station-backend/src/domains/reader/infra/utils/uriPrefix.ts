export const UriPrefix = {
  HTTP: 0x03,
  HTTPS: 0x04,
} as const;

// eslint-disable-next-line ts/no-redeclare
export type UriPrefix = (typeof UriPrefix)[keyof typeof UriPrefix];
