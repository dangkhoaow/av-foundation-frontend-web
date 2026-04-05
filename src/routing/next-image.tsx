import type { CSSProperties, ImgHTMLAttributes } from 'react';
import { withBasePath } from '@/lib/assets';

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
};

const buildFillStyle = (style?: CSSProperties): CSSProperties => ({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  ...(style || {}),
});

export default function Image({
  src,
  alt,
  fill,
  priority,
  quality,
  sizes,
  style,
  loading,
  ...rest
}: ImageProps) {
  const resolvedStyle = fill ? buildFillStyle(style) : style;
  const resolvedSrc = withBasePath(src);

  if (quality) {
    console.info('[Image] quality prop ignored in static build', { src: resolvedSrc, quality });
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      sizes={sizes}
      style={resolvedStyle}
      loading={priority ? 'eager' : loading || 'lazy'}
      {...rest}
    />
  );
}
