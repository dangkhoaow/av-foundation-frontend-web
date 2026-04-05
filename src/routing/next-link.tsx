import { Link as RouterLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useLocale } from '@/i18n/LocaleProvider';
import { isExternalLink, withLocale } from './locale';

type NextLinkProps = {
  href: string;
  children: ReactNode;
  scroll?: boolean;
  prefetch?: boolean;
  replace?: boolean;
  state?: unknown;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  target?: string;
  rel?: string;
  'aria-label'?: string;
};

export default function Link({
  href,
  children,
  scroll,
  prefetch,
  replace,
  state,
  className,
  onClick,
  target,
  rel,
  'aria-label': ariaLabel,
}: NextLinkProps) {
  const locale = useLocale();
  const to = withLocale(href, locale);

  if (isExternalLink(href)) {
    return (
      <a href={href} className={className} onClick={onClick} target={target} rel={rel} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  if (scroll === false) {
    console.info('[Link] Navigation without scroll', { to });
  }

  return (
    <RouterLink
      to={to}
      replace={replace}
      state={state}
      className={className}
      onClick={onClick}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
    >
      {children}
    </RouterLink>
  );
}
