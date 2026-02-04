interface StatusEntry {
  status: number;
  code: string;
}

export const ErrorCode = {
  INTERNAL: {
    status: 500,
    code: "INTERNAL",
  },
  BAD_REQUEST: {
    status: 400,
    code: "BAD_REQUEST",
  },
  CONFLICT: {
    status: 409,
    code: "CONFLICT",
  },
  UNAUTHORIZED: {
    status: 401,
    code: "UNAUTHORIZED",
  },
  FORBIDDEN: {
    status: 403,
    code: "FORBIDDEN",
  },
  LOGIN_TIME_OUT: {
    status: 440,
    code: "LOGIN_TIME_OUT",
  },
  NOT_FOUND: {
    status: 404,
    code: "NOT_FOUND",
  },
} as const satisfies Record<string, StatusEntry>;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export const OkCode = {
  OK: {
    status: 200,
    code: "OK",
  },
} as const satisfies Record<string, StatusEntry>;

export type OkCode = (typeof OkCode)[keyof typeof OkCode];
