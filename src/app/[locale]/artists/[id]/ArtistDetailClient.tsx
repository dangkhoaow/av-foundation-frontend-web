/**
 * Artist Detail Page - Client Component
 * Handles UI interactivity (tabs, animations) with pre-fetched data from server
 * 
 * Architecture: Hybrid approach
 * - Data is fetched on server (page.tsx) for SEO and faster initial load
 * - This component handles client-side interactivity only
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getArtistImageUrl, type ArtistDetail } from '@/lib/api';
import './ArtistDetailPage.css';

interface ArtistDetailClientProps {
  artist: ArtistDetail;
}

type TabKey = 'biography' | 'education' | 'exhibitions' | 'artworks' | 'awards' | 'documents';

interface TabItem {
  key: TabKey;
  label: string;
}

const TABS: TabItem[] = [
  { key: 'biography', label: 'Tiểu sử' },
  { key: 'education', label: 'Học vấn' },
  { key: 'exhibitions', label: 'Triển lãm' },
  { key: 'artworks', label: 'Tác phẩm' },
  { key: 'awards', label: 'Ghi nhận' },
  { key: 'documents', label: 'Tài liệu' },
];

export function ArtistDetailClient({ artist }: ArtistDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('biography');
  const [imageLoaded, setImageLoaded] = useState(false);

  const portraitUrl = getArtistImageUrl(artist.portraitImage);
  
  // Format generation/period display
  const getGenerationDisplay = () => {
    if (artist.period) return artist.period;
    if (artist.generation) return artist.generation;
    return null;
  };

  // Get artist statement/quote
  const getArtistStatement = () => {
    return artist.artistStatement || artist.artistStatementEn || null;
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'biography':
        return (
          <div className="artist-tab-content">
            {/* Tiểu Sử Chi Tiết - Luôn hiển thị */}
            <div className="artist-content-section">
              <h3 className="artist-content-title">Tiểu Sử Chi Tiết</h3>
              <p className="artist-content-text">
                {artist.biography || ''}
              </p>
            </div>
            {/* Cột Mốc Quan Trọng - Luôn hiển thị */}
            <div className="artist-content-section">
              <h3 className="artist-content-title">Cột Mốc Quan Trọng</h3>
              {artist.milestones && artist.milestones.length > 0 ? (
                <ul className="artist-content-list">
                  {artist.milestones.map((milestone, index) => (
                    <li key={index}>{milestone}</li>
                  ))}
                </ul>
              ) : (
                <p className="artist-content-text"></p>
              )}
            </div>
            {/* Ảnh Hưởng Nghệ Thuật - Luôn hiển thị */}
            <div className="artist-content-section">
              <h3 className="artist-content-title">Ảnh Hưởng Nghệ Thuật</h3>
              {artist.artInfluences && artist.artInfluences.length > 0 ? (
                <ul className="artist-content-list">
                  {artist.artInfluences.map((influence, index) => (
                    <li key={index}>{influence}</li>
                  ))}
                </ul>
              ) : (
                <p className="artist-content-text"></p>
              )}
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="artist-tab-content">
            {artist.education && artist.education.length > 0 && (
              <div className="artist-content-section">
                <h3 className="artist-content-title">Học Vấn</h3>
                <ul className="artist-content-list">
                  {artist.education.map((edu, index) => (
                    <li key={index}>{edu}</li>
                  ))}
                </ul>
              </div>
            )}
            {artist.mentors && artist.mentors.length > 0 && (
              <div className="artist-content-section">
                <h3 className="artist-content-title">Người Hướng Dẫn</h3>
                <ul className="artist-content-list">
                  {artist.mentors.map((mentor, index) => (
                    <li key={index}>{mentor}</li>
                  ))}
                </ul>
              </div>
            )}
            {artist.workshops && artist.workshops.length > 0 && (
              <div className="artist-content-section">
                <h3 className="artist-content-title">Workshops & Khóa Học</h3>
                <ul className="artist-content-list">
                  {artist.workshops.map((workshop, index) => (
                    <li key={index}>{workshop}</li>
                  ))}
                </ul>
              </div>
            )}
            {(!artist.education || artist.education.length === 0) && 
             (!artist.mentors || artist.mentors.length === 0) && 
             (!artist.workshops || artist.workshops.length === 0) && (
              <p className="artist-content-empty">Chưa có thông tin học vấn.</p>
            )}
          </div>
        );

      case 'exhibitions':
        return (
          <div className="artist-tab-content">
            {artist.soloExhibitions && artist.soloExhibitions.length > 0 && (
              <div className="artist-content-section">
                <h3 className="artist-content-title">Triển Lãm Cá Nhân</h3>
                <ul className="artist-content-list">
                  {artist.soloExhibitions.map((exhibition, index) => (
                    <li key={index}>{exhibition}</li>
                  ))}
                </ul>
              </div>
            )}
            {artist.groupExhibitions && artist.groupExhibitions.length > 0 && (
              <div className="artist-content-section">
                <h3 className="artist-content-title">Triển Lãm Nhóm</h3>
                <ul className="artist-content-list">
                  {artist.groupExhibitions.map((exhibition, index) => (
                    <li key={index}>{exhibition}</li>
                  ))}
                </ul>
              </div>
            )}
            {artist.internationalExhibitions && artist.internationalExhibitions.length > 0 && (
              <div className="artist-content-section">
                <h3 className="artist-content-title">Triển Lãm Quốc Tế</h3>
                <ul className="artist-content-list">
                  {artist.internationalExhibitions.map((exhibition, index) => (
                    <li key={index}>{exhibition}</li>
                  ))}
                </ul>
              </div>
            )}
            {(!artist.soloExhibitions || artist.soloExhibitions.length === 0) && 
             (!artist.groupExhibitions || artist.groupExhibitions.length === 0) && 
             (!artist.internationalExhibitions || artist.internationalExhibitions.length === 0) && (
              <p className="artist-content-empty">Chưa có thông tin triển lãm.</p>
            )}
          </div>
        );

      case 'artworks':
        return (
          <div className="artist-tab-content">
            <div className="artist-artworks-summary">
              <p className="artist-content-text">
                Nghệ sĩ hiện có <strong>{artist.artworksCount || 0}</strong> tác phẩm trong bộ sưu tập.
              </p>
              {artist.artworksCount > 0 && (
                <Link href={`/collection?artist=${artist.id}`} className="artist-artworks-link">
                  Xem tất cả tác phẩm →
                </Link>
              )}
            </div>
          </div>
        );

      case 'awards':
        return (
          <div className="artist-tab-content">
            {artist.awards && artist.awards.length > 0 && (
              <div className="artist-content-section">
                <h3 className="artist-content-title">Giải Thưởng & Ghi Nhận</h3>
                <ul className="artist-content-list">
                  {artist.awards.map((award, index) => (
                    <li key={index}>{award}</li>
                  ))}
                </ul>
              </div>
            )}
            {artist.representatives && artist.representatives.length > 0 && (
              <div className="artist-content-section">
                <h3 className="artist-content-title">Đại Diện</h3>
                <ul className="artist-content-list">
                  {artist.representatives.map((rep, index) => (
                    <li key={index}>{rep}</li>
                  ))}
                </ul>
              </div>
            )}
            {(!artist.awards || artist.awards.length === 0) && 
             (!artist.representatives || artist.representatives.length === 0) && (
              <p className="artist-content-empty">Chưa có thông tin ghi nhận.</p>
            )}
          </div>
        );

      case 'documents':
        return (
          <div className="artist-tab-content">
            {artist.pressLinks && artist.pressLinks.length > 0 && (
              <div className="artist-content-section">
                <h3 className="artist-content-title">Báo Chí</h3>
                <ul className="artist-content-list artist-links-list">
                  {artist.pressLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {artist.booksCatalogues && artist.booksCatalogues.length > 0 && (
              <div className="artist-content-section">
                <h3 className="artist-content-title">Sách & Catalogue</h3>
                <ul className="artist-content-list">
                  {artist.booksCatalogues.map((book, index) => (
                    <li key={index}>{book}</li>
                  ))}
                </ul>
              </div>
            )}
            {artist.interviewsVideos && artist.interviewsVideos.length > 0 && (
              <div className="artist-content-section">
                <h3 className="artist-content-title">Phỏng Vấn & Video</h3>
                <ul className="artist-content-list artist-links-list">
                  {artist.interviewsVideos.map((video, index) => (
                    <li key={index}>
                      <a href={video} target="_blank" rel="noopener noreferrer">{video}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {artist.website && (
              <div className="artist-content-section">
                <h3 className="artist-content-title">Website</h3>
                <a href={artist.website} target="_blank" rel="noopener noreferrer" className="artist-website-link">
                  {artist.website}
                </a>
              </div>
            )}
            {(!artist.pressLinks || artist.pressLinks.length === 0) && 
             (!artist.booksCatalogues || artist.booksCatalogues.length === 0) && 
             (!artist.interviewsVideos || artist.interviewsVideos.length === 0) && 
             !artist.website && (
              <p className="artist-content-empty">Chưa có tài liệu.</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="artist-detail-page">
      {/* Back Button - Nằm ngoài container */}
      <Link href="/artists" className="artist-detail-back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>

      <div className="artist-detail-container">
        <div className="artist-detail-main">
          {/* Left Column - Portrait & Quote */}
          <div className="artist-detail-left">
            <div className="artist-portrait">
              {portraitUrl ? (
                <img 
                  src={portraitUrl} 
                  alt={artist.fullName}
                  className={imageLoaded ? 'loaded' : 'loading'}
                  onLoad={() => setImageLoaded(true)}
                />
              ) : (
                <div className="artist-portrait-placeholder">
                  {artist.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            {/* Artist Statement/Quote */}
            {getArtistStatement() && (
              <div className="artist-quote">
                <p className="artist-quote__mark">"</p>
                <p className="artist-quote__text">{getArtistStatement()}</p>
              </div>
            )}
          </div>

          {/* Right Column - Info & Tabs */}
          <div className="artist-detail-right">
            {/* Upper Section: Header + Info + Details (gap 21px) */}
            <div className="artist-upper-section">
              {/* Header Section (Name + Bio, gap 20px) */}
              <div className="artist-header">
                <h1 className="artist-name">{artist.fullName}</h1>
                {artist.bioSummary && (
                  <p className="artist-bio">{artist.bioSummary}</p>
                )}
              </div>

              {/* Info Bar */}
              <div className="artist-info-bar">
                {getGenerationDisplay() && (
                  <span className="artist-info-bar__item">{getGenerationDisplay()}</span>
                )}
                {artist.placeOfBirth && (
                  <span className="artist-info-bar__item">Sinh tại {artist.placeOfBirth}</span>
                )}
                {artist.currentResidence && (
                  <span className="artist-info-bar__item">Hiện tại: {artist.currentResidence}</span>
                )}
                {artist.artworksCount > 0 && (
                  <span className="artist-info-bar__item">{artist.artworksCount} tác phẩm</span>
                )}
              </div>

              {/* Details Section - Luôn hiển thị 4 mục */}
              <div className="artist-details">
                <div className="artist-detail-section">
                  <h3 className="artist-detail-title">Chất Liệu Chính</h3>
                  <p className="artist-detail-text">
                    {artist.primaryMaterials && artist.primaryMaterials.length > 0 
                      ? artist.primaryMaterials.join(' • ') 
                      : ''}
                  </p>
                </div>
                <div className="artist-detail-section">
                  <h3 className="artist-detail-title">Kỹ Thuật</h3>
                  <p className="artist-detail-text">
                    {artist.techniques && artist.techniques.length > 0 
                      ? artist.techniques.join(' • ') 
                      : ''}
                  </p>
                </div>
                <div className="artist-detail-section">
                  <h3 className="artist-detail-title">Chủ Đề</h3>
                  <p className="artist-detail-text">
                    {artist.themes && artist.themes.length > 0 
                      ? artist.themes.join(' • ') 
                      : ''}
                  </p>
                </div>
                <div className="artist-detail-section">
                  <h3 className="artist-detail-title">Phong Cách</h3>
                  <p className="artist-detail-text">
                    {artist.styles && artist.styles.length > 0 
                      ? artist.styles.join(' • ') 
                      : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Lower Section: Tabs + Content (gap 36px) */}
            <div className="artist-tabs-container">
              <div className="artist-tabs">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    className={`artist-tab ${activeTab === tab.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistDetailClient;
