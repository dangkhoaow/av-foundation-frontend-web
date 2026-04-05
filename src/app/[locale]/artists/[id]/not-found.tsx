/**
 * Artist Not Found Page
 * Displayed when artist ID doesn't exist or API returns 404
 */

import Link from 'next/link';
import './ArtistDetailPage.css';

export default function ArtistNotFound() {
  return (
    <div className="artist-detail-page">
      <div className="artist-detail-error">
        <h2>Không tìm thấy nghệ sĩ</h2>
        <p>Nghệ sĩ này không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
        <Link href="/artists" className="artist-detail-error-button">
          Quay lại danh sách nghệ sĩ
        </Link>
      </div>
    </div>
  );
}



