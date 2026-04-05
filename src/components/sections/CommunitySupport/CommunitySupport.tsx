/**
 * CommunitySupport Component
 * Server Component - No interactivity needed
 * Using next/image for optimization
 */

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Typography } from '@/design-system/atoms/Typography';
import './CommunitySupport.css';

interface TimelineItem {
  year: string;
  description: string;
  activities: string[];
}

export function CommunitySupport() {
  const t = useTranslations('home.communitySupport');
  
  const timelineItems: TimelineItem[] = [
    {
      year: t('victorTardieu.title'),
      description: t('victorTardieu.description'),
      activities: []
    },
    {
      year: t('mandarineRoad.title'),
      description: t('mandarineRoad.description'),
      activities: []
    }
  ];

  return (
    <section className="community-support section">
      <div className="container">
        <div className="community-support__layout">
          {/* Left side: Title + Timeline content */}
          <div className="community-support__content-wrapper">
            <div className="community-support__content">
              <Typography variant="display-lg" as="h2" className="community-support__title">
                {t('title')}
              </Typography>

              <div className="community-support__timeline-box">
                <div className="community-support__timeline">
                  {timelineItems.map((item) => (
                    <div key={item.year} className="timeline-item">
                      <div className="timeline-item__content">
                        <div className="timeline-item__year">
                          {item.year}
                        </div>
                        <Typography variant="body-md" className="timeline-item__description">
                          {item.description}
                        </Typography>

                        {item.activities.length > 0 && (
                          <div className="timeline-item__activities">
                            {item.activities.map((activity, activityIndex) => (
                              <div key={activityIndex} className="activity-item">
                                <Typography variant="body-sm" weight="medium" className="activity-item__text">
                                  {activity}
                                </Typography>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Decorative sculpture image with next/image */}
          <div className="community-support__image-wrapper">
            <div className="community-support__image">
              <Image
                src="/images/community-support/sculpture.png"
                alt="Classical sculpture with decorative elements"
                width={600}
                height={800}
                className="community-support__image-content"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CommunitySupport;

