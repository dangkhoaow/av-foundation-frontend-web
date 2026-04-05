import type { CSSProperties, ImgHTMLAttributes } from 'react';

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

  if (quality) {
    console.info('[Image] quality prop ignored in static build', { src, quality });
  }

  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      style={resolvedStyle}
      loading={priority ? 'eager' : loading || 'lazy'}
      {...rest}
    />
  );
}
