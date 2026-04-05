import { describe, expect, it } from 'vitest';
import { resolveImageUrl, withBasePath } from './assets';

const viteBaseUrl = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

describe('asset URL resolution', () => {
  it('prefixes frontend assets with the Vite base path', () => {
    expect(withBasePath('/images/artists/portrait-french-female.png')).toBe(
      `${viteBaseUrl}images/artists/portrait-french-female.png`
    );
  });

  it('sends API and image paths to the backend base URL', () => {
    expect(
      resolveImageUrl('/api/public/file/9e9f191d-3694-4b20-8dca-d2ccecc3464a', 'https://media.example.com')
    ).toBe('https://media.example.com/api/public/file/9e9f191d-3694-4b20-8dca-d2ccecc3464a');
    expect(
      resolveImageUrl('/images/artists/portrait-french-female.png', 'https://media.example.com')
    ).toBe('https://media.example.com/images/artists/portrait-french-female.png');
  });

  it('leaves absolute and data URLs unchanged', () => {
    expect(resolveImageUrl('https://cdn.example.com/image.jpg', 'https://media.example.com')).toBe(
      'https://cdn.example.com/image.jpg'
    );
    expect(resolveImageUrl('data:image/png;base64,abc', 'https://media.example.com')).toBe(
      'data:image/png;base64,abc'
    );
  });
});
