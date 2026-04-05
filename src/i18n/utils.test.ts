import { describe, it, expect } from 'vitest';
import { resolveMessage, type Messages } from './utils';

describe('i18n resolveMessage', () => {
  const messages: Messages = {
    nav: {
      home: 'Home',
    },
  };

  it('returns nested message values', () => {
    expect(resolveMessage(messages, 'nav.home')).toBe('Home');
  });

  it('returns undefined for missing keys', () => {
    expect(resolveMessage(messages, 'nav.missing')).toBeUndefined();
  });
});
