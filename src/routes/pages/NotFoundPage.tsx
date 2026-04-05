import { Link } from 'react-router-dom';
import { useLocale } from '@/i18n/LocaleProvider';

export function NotFoundPage() {
  const locale = useLocale();

  return (
    <div className="not-found-page">
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to={`/${locale}`}>Back to home</Link>
    </div>
  );
}
