import type { AxiosError } from "axios";

export const processAuthError = (error: unknown): string[] => {
  const err = error as AxiosError<{
    errors?: string[];
    message?: string;
    error?: string;
  }>;
  if (Array.isArray(err.response?.data?.errors)) {
    return err.response.data.errors;
  }

  if (err.response?.data?.message) {
    return [err.response.data.message];
  }

  if (err.response?.data?.error) {
    return [err.response.data.error];
  }

  return ["Error inesperado del servidor"];
};
