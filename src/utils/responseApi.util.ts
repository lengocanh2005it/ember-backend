import { ApiResponse } from 'src/interfaces/api-response.interface';

export const formatApiResponse = <T>(
  statusCode: number,
  message: string,
  data?: T,
  error?: string,
): ApiResponse => {
  return {
    statusCode,
    message,
    ...(data && { data }),
    ...(error && { error }),
  };
};
