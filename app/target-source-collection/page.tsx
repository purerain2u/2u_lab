'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from './TargetSourceCollection.module.css';
import { SearchResult } from '../target-search/utils/youtubeApi';

// 동적 임포트 사용
const Image = dynamic(() => import('next/image'), { ssr: false });
const VideoAnalysisPopup = dynamic(() => import('../target-search/components/VideoAnalysisPopup'), { ssr: false });

const TargetSourceCollectionPage: React.FC = () => {
  const [collectedSources, setCollectedSources] = useState<SearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof SearchResult>('viewCount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedVideo, setSelectedVideo] = useState<SearchResult | null>(null);
  const [videoPopup, setVideoPopup] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSources = () => {
      try {
        const storedSources = localStorage.getItem('collectedSources');
        if (storedSources) {
          setCollectedSources(JSON.parse(storedSources));
        }
      } catch (error) {
        console.error('Error loading collected sources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSources();
  }, []);

  const handleSort = (column: keyof SearchResult) => {
    if (column === 'title') return; // 제목 컬럼은 정렬하지 않음
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedSources = useMemo(() => {
    if (sortColumn === 'title') return collectedSources; // 제목으로 정렬하지 않음
    return [...collectedSources].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [collectedSources, sortColumn, sortDirection]);

  const renderSortArrow = (column: keyof SearchResult) => {
    if (column === 'title' || sortColumn !== column) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  const handleThumbnailClick = (videoId: string) => {
    setVideoPopup(videoId);
  };

  const handleVideoClick = (video: SearchResult) => {
    setSelectedVideo(video);
  };

  const handleDeleteVideo = (videoId: string) => {
    const updatedSources = collectedSources.filter(source => source.videoId !== videoId);
    setCollectedSources(updatedSources);
    localStorage.setItem('collectedSources', JSON.stringify(updatedSources));
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.leftContent}>
            <Link href="/" className={styles.logo}>
              2U_lab
            </Link>
          </div>
          <nav className={styles.nav}>
            <Link href="/target-search" className={styles.navItem}>타겟영상찾기</Link>
            <Link href="/100m-view" className={styles.navItem}>100M view 따라잡기</Link>
            <Link href="/target-source-collection" className={styles.navItem}>타겟소스수집목록</Link>
            <Link href="/membership" className={styles.navItem}>멤버십 신청</Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.pageTitle}>타겟 소스 수집 List</h1>
        {collectedSources.length > 0 ? (
          <table className={styles.resultTable}>
            <thead>
              <tr>
                <th>선택</th>
                <th>썸네일</th>
                <th>제목</th>
                <th onClick={() => handleSort('subscriberCount')}>구독자 수{renderSortArrow('subscriberCount')}</th>
                <th onClick={() => handleSort('viewCount')}>조회수{renderSortArrow('viewCount')}</th>
                <th onClick={() => handleSort('likeCount')}>좋아요 수{renderSortArrow('likeCount')}</th>
                <th onClick={() => handleSort('contribution')}>기여도{renderSortArrow('contribution')}</th>
                <th onClick={() => handleSort('performance')}>성과{renderSortArrow('performance')}</th>
                <th onClick={() => handleSort('totalVideos')}>총 영상 수{renderSortArrow('totalVideos')}</th>
                <th onClick={() => handleSort('publishedAt')}>게시일{renderSortArrow('publishedAt')}</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {sortedSources.map((source) => (
                <tr key={source.videoId}>
                  <td><input type="checkbox" checked readOnly /></td>
                  <td>
                    <div className={styles.thumbnailContainer}>
                      <Image
                        src={source.thumbnailUrl}
                        alt={source.title}
                        width={160}
                        height={90}
                        className={styles.thumbnail}
                        onClick={() => handleThumbnailClick(source.videoId)}
                        objectFit="cover"
                      />
                    </div>
                  </td>
                  <td>
                    <a href="#" onClick={() => handleVideoClick(source)}>
                      {source.title}
                    </a>
                  </td>
                  <td>{source.subscriberCount?.toLocaleString()}</td>
                  <td>{source.viewCount.toLocaleString()}</td>
                  <td>{source.likeCount.toLocaleString()}</td>
                  <td className={`${styles[source.contribution.toLowerCase()]} ${styles.resultCell}`}>
                    {source.contribution}
                  </td>
                  <td className={`${styles[source.performance.toLowerCase()]} ${styles.resultCell}`}>
                    {source.performance}
                  </td>
                  <td>{source.totalVideos?.toLocaleString()}</td>
                  <td className={styles.publishedAt}>{source.publishedAt}</td>
                  <td>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteVideo(source.videoId)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.emptyMessage}>수집된 소스가 없습니다.</p>
        )}
        {videoPopup && (
          <div className={styles.videoPopupOverlay}>
            <div className={styles.videoPopupContent}>
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videoPopup}`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
              <button className={styles.closeButton} onClick={() => setVideoPopup(null)}>X</button>
            </div>
          </div>
        )}
        {selectedVideo && (
          <VideoAnalysisPopup
            videoData={selectedVideo}
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </main>
    </div>
  );
};

export default TargetSourceCollectionPage;
