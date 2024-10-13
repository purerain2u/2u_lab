'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // 이 부분을 수정
import Image from 'next/image';
import Link from 'next/link';
import styles from './TargetSearch.module.css';
import SearchForm from './components/SearchForm';
import VideoAnalysisPopup from './components/VideoAnalysisPopup';
import { searchYouTube, SearchResult } from './utils/youtubeApi';

const TargetSearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof SearchResult>('viewCount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedVideo, setSelectedVideo] = useState<SearchResult | null>(null);
  const [videoPopup, setVideoPopup] = useState<string | null>(null);
  const [selectedVideos, setSelectedVideos] = useState<SearchResult[]>([]);
  const router = useRouter();  // 이 줄을 추가

  const loadInitialVideos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const initialResults = await searchYouTube('AI자동화');
      setSearchResults(initialResults);
    } catch (error) {
      console.error('초기 비디오 로드 중 오류 발생:', error);
      setError('비디오를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialVideos();
  }, []);

  const handleSearch = async (searchTerm: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchYouTube(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      setError('검색 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (column: keyof SearchResult) => {
    if (column === 'title') return; // 제목 컬럼은 정렬하지 않음
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedResults = useMemo(() => {
    if (sortColumn === 'title') return searchResults; // 제목으로 정렬하지 않음
    return [...searchResults].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [searchResults, sortColumn, sortDirection]);

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

  const handleCheckboxChange = (video: SearchResult) => {
    setSelectedVideos(prev => {
      const isSelected = prev.some(v => v.videoId === video.videoId);
      let updatedVideos;
      if (isSelected) {
        updatedVideos = prev.filter(v => v.videoId !== video.videoId);
      } else {
        updatedVideos = [...prev, video];
      }
      // 로컬 스토리지에 선택된 비디오 저장
      localStorage.setItem('collectedSources', JSON.stringify(updatedVideos));
      return updatedVideos;
    });
  };

  const handleCollectSources = () => {
    if (selectedVideos.length > 0) {
      // 선택된 비디오 정보를 로컬 스토리지에 저장
      localStorage.setItem('collectedSources', JSON.stringify(selectedVideos));
      // 타겟소스수집페이지로 이동
      router.push('/target-source-collection');
    } else {
      alert('선택된 영상이 없습니다.');
    }
  };

  useEffect(() => {
    // 페이지 로드 시 로컬 스토리지에서 선택된 비디오 불러오기
    const storedVideos = localStorage.getItem('collectedSources');
    if (storedVideos) {
      setSelectedVideos(JSON.parse(storedVideos));
    }
  }, []);

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
            <Link href="/target-search" className={styles.navItem}>타겟영상검색</Link>
            <Link href="/100m-view" className={styles.navItem}>100M view 따라잡기</Link>
            <Link href="/target-source-collection" className={styles.navItem}>타겟소스수집목록</Link>
            <Link href="/membership" className={styles.navItem}>멤버십 신청</Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.pageTitle}>타겟 영상 검색</h1>
        <div className={styles.searchContainer}>
          <SearchForm onSearch={handleSearch} />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {isLoading && <p className={styles.loading}>비디오 로딩 중...</p>}
        {!isLoading && searchResults.length > 0 && (
          <div className={styles.tableContainer}>
            <table className={styles.resultTable}>
              <thead>
                <tr>
                  <th>선택</th>
                  <th>썸네일</th>
                  <th>제목</th>
                  <th onClick={() => handleSort('subscriberCount')} className={styles.sortableHeader}>
                    구독자{renderSortArrow('subscriberCount')}
                  </th>
                  <th onClick={() => handleSort('viewCount')} className={styles.sortableHeader}>
                    조회수{renderSortArrow('viewCount')}
                  </th>
                  <th onClick={() => handleSort('likeCount')} className={styles.sortableHeader}>
                    좋아요{renderSortArrow('likeCount')}
                  </th>
                  <th onClick={() => handleSort('contribution')} className={styles.sortableHeader}>
                    기여도{renderSortArrow('contribution')}
                  </th>
                  <th onClick={() => handleSort('performance')} className={styles.sortableHeader}>
                    성과도{renderSortArrow('performance')}
                  </th>
                  <th onClick={() => handleSort('totalVideos')} className={styles.sortableHeader}>
                    총&nbsp;영상&nbsp;수{renderSortArrow('totalVideos')}
                  </th>
                  <th onClick={() => handleSort('publishedAt')} className={styles.sortableHeader}>
                    게시일{renderSortArrow('publishedAt')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.map((result) => (
                  <tr key={result.videoId}>
                    <td>
                      <input 
                        type="checkbox" 
                        className={styles.checkbox} 
                        onChange={() => handleCheckboxChange(result)}
                        checked={selectedVideos.some(v => v.videoId === result.videoId)}
                      />
                    </td>
                    <td>
                      <div className={styles.thumbnailContainer}>
                        <Image 
                          src={result.thumbnailUrl} 
                          alt={result.title} 
                          layout="fill"
                          objectFit="cover"
                          className={styles.thumbnail}
                          onClick={() => handleThumbnailClick(result.videoId)}
                        />
                        {selectedVideos.some(v => v.videoId === result.videoId) && (
                          <span className={styles.collectedIcon}>수집됨</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <a href="#" onClick={() => handleVideoClick(result)}>
                        {result.title}
                      </a>
                    </td>
                    <td>{result.subscriberCount.toLocaleString()}</td>
                    <td>{result.viewCount.toLocaleString()}</td>
                    <td>{result.likeCount.toLocaleString()}</td>
                    <td className={`${styles[result.contribution.toLowerCase()]} ${styles.resultCell}`}>
                      {result.contribution}
                    </td>
                    <td className={`${styles[result.performance.toLowerCase()]} ${styles.resultCell}`}>
                      {result.performance}
                    </td>
                    <td>{result.totalVideos.toLocaleString()}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{result.publishedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {videoPopup && (
          <div className={styles.videoPopup}>
            <div className={styles.videoWrapper}>
              <button className={styles.closeButton} onClick={() => setVideoPopup(null)}>X</button>
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videoPopup}`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
        {selectedVideo && (
          <VideoAnalysisPopup
            videoData={selectedVideo}
            onClose={() => setSelectedVideo(null)}
          />
        )}
        {selectedVideos.length > 0 && (
          <button onClick={handleCollectSources} className={styles.collectButton}>
            선택한 영상 수집하기 ({selectedVideos.length})
          </button>
        )}
      </main>
    </div>
  );
};

export default TargetSearchPage;