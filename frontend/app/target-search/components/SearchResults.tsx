import React from 'react';
import styles from '../TargetSearch.module.css';
import Image from 'next/image';

interface SearchResult {
  // 검색 결과의 속성을 정의합니다.
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  videoId: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  subscriberCount: number;
  totalVideos: number;
  contribution: string;
  performance: string;
}

interface SearchResultsProps {
  results: SearchResult[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div className={styles.searchResults}>
      {results.map((result, index) => (
        <div key={index} className={styles.resultItem}>
          <Image 
            src={result.thumbnailUrl} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }} 
            alt={result.title}
          />
          <h3>{result.title}</h3>
          <p>채널: {result.channelTitle}</p>
          <p>업로드 날짜: {result.publishedAt}</p>
          <p>조회수: {result.viewCount}</p>
          <p>좋아요 수: {result.likeCount}</p>
          <p>댓글 수: {result.commentCount}</p>
          <p>구독자 수: {result.subscriberCount}</p>
          <p>채널 총 영상 수: {result.totalVideos}</p>
          <p className={styles[result.contribution]}>기여도: {result.contribution}</p>
          <p className={styles[result.performance]}>성과도: {result.performance}</p>
          <a href={`https://www.youtube.com/watch?v=${result.videoId}`} target="_blank" rel="noopener noreferrer">
            영상 보기
          </a>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
