import toast from 'react-hot-toast';

export function handleApiError(
  err: unknown,
  fallbackMessage = 'An unexpected error occurred',
  silent = false,
): void {
  const message =
    err instanceof Error
      ? (err.message || fallbackMessage)
      : (typeof err === 'string' ? err : fallbackMessage);

  console.error('[API Error]', message, err);

  if (!silent) {
    toast.error(message);
  }
}
