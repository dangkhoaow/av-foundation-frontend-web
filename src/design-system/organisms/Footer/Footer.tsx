/**
 * Organism Component - Footer
 * Main footer for Next.js App Router
 * Server Component with translations
 */

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Typography } from '../../atoms/Typography';
import { Icon } from '../../atoms/Icon';
import './Footer.css';

export function Footer() {
  const t = useTranslations('footer');
  
  return (
    <footer className="ds-footer">
      <div className="ds-footer__container">
        <div className="ds-footer__content">
          <div className="ds-footer__main">
            <div className="ds-footer__info">
              <Typography variant="h4" as="h3" className="ds-footer__title">
                {t('title')}
              </Typography>
              <div className="ds-footer__contact">
                <Typography variant="body-sm" as="p">
                  {t('contact.address1')}
                </Typography>
                <Typography variant="body-sm" as="p">
                  {t('contact.address2')}
                </Typography>
                <Typography variant="body-sm" as="p">
                  {t('contact.email')}
                </Typography>
              </div>
              <div className="ds-footer__social">
                <a
                  href="https://facebook.com"
                  className="ds-footer__social-link"
                  aria-label={t('socialLinks.facebook')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="facebook" size="md" />
                </a>
                <a
                  href="https://instagram.com"
                  className="ds-footer__social-link"
                  aria-label={t('socialLinks.instagram')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="instagram" size="md" />
                </a>
                <a
                  href="https://twitter.com"
                  className="ds-footer__social-link"
                  aria-label={t('socialLinks.twitter')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="twitter" size="md" />
                </a>
                <a
                  href="https://tiktok.com"
                  className="ds-footer__social-link"
                  aria-label={t('socialLinks.tiktok')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="tiktok" size="md" />
                </a>
              </div>
            </div>

            <div className="ds-footer__links">
              <div className="ds-footer__section">
                <Typography variant="body-md" weight="semibold" as="h4" className="ds-footer__section-title">
                  {t('sections.whoWeAre')}
                </Typography>
                <div className="ds-footer__section-content">
                  <Link href="/about" className="ds-footer__link">
                    <Typography variant="body-sm">{t('sections.aboutUs')}</Typography>
                  </Link>
                </div>
              </div>

              <div className="ds-footer__section">
                <Typography variant="body-md" weight="semibold" as="h4" className="ds-footer__section-title">
                  {t('sections.otherInfo')}
                </Typography>
                <div className="ds-footer__section-content">
                  <a
                    href="https://vsvcapital.com"
                    className="ds-footer__link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Typography variant="body-sm">Vsvcapital</Typography>
                  </a>
                  <a
                    href="https://artcozy.com"
                    className="ds-footer__link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Typography variant="body-sm">artcozy</Typography>
                  </a>
                  <a
                    href="https://vsvfoundation.com"
                    className="ds-footer__link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Typography variant="body-sm">vsvfoundation</Typography>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="ds-footer__bottom">
            <Typography variant="body-sm" className="ds-footer__copyright">
              {t('copyright')}
            </Typography>
          </div>
        </div>

        <div className="ds-footer__logo">
          <Image
            src="/images/footer/av-logo-watermark.svg"
            alt="AV Foundation"
            width={200}
            height={200}
            className="ds-footer__logo-img"
          />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
