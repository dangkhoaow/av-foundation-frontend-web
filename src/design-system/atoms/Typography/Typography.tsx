/**
 * Atom Component - Typography
 * Reusable text component with semantic HTML and design system integration
 * Next.js optimized - Server Component by default
 */

import './Typography.css';

type TypographyVariant = 
  | 'display-xl'
  | 'display-lg'
  | 'display-md'
  | 'display-sm'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body-xl'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'body-xs';

type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';

export interface TypographyProps {
  variant?: TypographyVariant;
  as?: TypographyElement;
  color?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'burgundy';
  align?: 'left' | 'center' | 'right';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  className?: string;
  children: React.ReactNode;
}

export function Typography({
  variant = 'body-md',
  as,
  color = 'primary',
  align = 'left',
  weight,
  className = '',
  children,
}: TypographyProps) {
  // Auto-determine element if not specified
  const getDefaultElement = (): TypographyElement => {
    if (variant.startsWith('h')) return variant as TypographyElement;
    if (variant.startsWith('display')) return 'h1';
    return 'p';
  };

  const Element = as || getDefaultElement();

  const classNames = [
    'ds-typography',
    `ds-typography--${variant}`,
    `ds-typography--color-${color}`,
    `ds-typography--align-${align}`,
    weight && `ds-typography--weight-${weight}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Element className={classNames}>{children}</Element>;
}

export default Typography;

