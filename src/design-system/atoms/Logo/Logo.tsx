/**
 * Atom Component - Logo
 * Reusable A&V Foundation logo component
 * Server Component (no interactivity needed)
 */

import Image from 'next/image';
import Link from 'next/link';
import './Logo.css';

export type LogoSize = 'sm' | 'md' | 'lg';

export interface LogoProps {
  /**
   * Size of the logo
   * sm: 42px (mobile header)
   * md: 60px (sidebar, desktop)
   * lg: 80px (special cases)
   */
  size?: LogoSize;
  
  /**
   * Whether logo should be a link to home
   */
  linkToHome?: boolean;
  
  /**
   * Additional CSS class
   */
  className?: string;
  
  /**
   * Priority loading for above-the-fold images
   */
  priority?: boolean;
}

const sizeMap: Record<LogoSize, number> = {
  sm: 42,
  md: 60,
  lg: 80,
};

export function Logo({ 
  size = 'md', 
  linkToHome = true,
  className = '',
  priority = false,
}: LogoProps) {
  const dimension = sizeMap[size];
  const classNames = ['ds-logo', `ds-logo--${size}`, className].filter(Boolean).join(' ');
  
  const logoImage = (
    <Image 
      src="/images/logo/av-logo.svg" 
      alt="Art & Venture Foundation" 
      width={dimension}
      height={dimension}
      className="ds-logo__image"
      priority={priority}
    />
  );

  if (linkToHome) {
    return (
      <Link href="/" className={classNames} aria-label="Go to homepage">
        {logoImage}
      </Link>
    );
  }

  return (
    <div className={classNames}>
      {logoImage}
    </div>
  );
}

export default Logo;


