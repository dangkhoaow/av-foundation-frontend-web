/**
 * Artist Detail Loading State
 * Shows skeleton UI while the server fetches artist data
 */

import './ArtistDetailPage.css';

export default function ArtistDetailLoading() {
  return (
    <div className="artist-detail-page">
      <div className="artist-detail-container">
        {/* Back Button Skeleton */}
        <div className="artist-detail-back skeleton" style={{ width: 42, height: 42 }} />
        
        <div className="artist-detail-main">
          {/* Left Column Skeleton */}
          <div className="artist-detail-left">
            <div className="artist-portrait skeleton" />
            <div className="artist-quote">
              <div className="skeleton" style={{ height: 120, width: '100%' }} />
            </div>
          </div>
          
          {/* Right Column Skeleton */}
          <div className="artist-detail-right">
            {/* Name */}
            <div className="artist-header">
              <div className="skeleton" style={{ height: 36, width: '60%', marginBottom: 16 }} />
              <div className="skeleton" style={{ height: 16, width: '100%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 16, width: '80%' }} />
            </div>
            
            {/* Info Bar */}
            <div className="artist-info-bar">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton" style={{ height: 24, width: 100 }} />
              ))}
            </div>
            
            {/* Details */}
            <div className="artist-details">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="artist-detail-section">
                  <div className="skeleton" style={{ height: 20, width: '30%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 16, width: '90%' }} />
                </div>
              ))}
            </div>
            
            {/* Tabs */}
            <div className="artist-tabs-container">
              <div className="artist-tabs">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="skeleton" style={{ height: 44, width: 80, flex: 1 }} />
                ))}
              </div>
              
              {/* Tab Content */}
              <div className="artist-tab-content">
                <div className="artist-content-section">
                  <div className="skeleton" style={{ height: 24, width: '40%', marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 16, width: '100%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 16, width: '95%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 16, width: '88%' }} />
                </div>
                <div className="artist-content-section">
                  <div className="skeleton" style={{ height: 24, width: '35%', marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 16, width: '70%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 16, width: '65%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 16, width: '60%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



