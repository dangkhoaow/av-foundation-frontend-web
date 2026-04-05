export type Messages = Record<string, unknown>;

export const resolveMessage = (messages: Messages, key: string): string | undefined => {
  const value = key.split('.').reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === 'object' && segment in acc) {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, messages);

  if (typeof value === 'string') {
    return value;
  }

  return undefined;
};
