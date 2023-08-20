export const ERRORS = {
  NOT_FOUND: 'ERR_NOT_FOUND',
  NOT_TOKEN: 'ERR_NOT_FOUND_TOKEN',
  DB_ERROR: 'ERR_DATABASE',
  TOKEN_ERROR: 'ERR_TOKEN_INVALID',
  PAYLOAD_ERROR: 'ERR_PAYLOAD_INVALID',
  SCHEMA_VALIDATION: 'ERR_SCHEMA_VALIDATION',
  SERVER_ERROR: 'ERR_SERVER',
};

export function AppError(
  errorCode: string,
  message: string,
  payload: any = undefined,
  statusCode: number = 400
) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    isBase64Encoded: false,
    body: JSON.stringify({
      success: false,
      errorCode,
      message,
      ...(payload && { payload }),
    }),
  };
}
