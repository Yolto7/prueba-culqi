export const SUCCESS = {
  OBTAINED: 'OK_OBTAINED',
  CREATED: 'OK_CREATED',
};

export function AppSuccess(code: string, message: string, data: any, statusCode = 200) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    isBase64Encoded: false,
    body: JSON.stringify({
      success: true,
      code,
      message,
      data,
    }),
  };
}
