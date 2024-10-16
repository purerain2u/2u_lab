'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './ThumbnailPage.module.css';

interface Thumbnail {
  url: string;
  title: string;
  videoId: string;
}

const BestThumbnailQuiz = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/youtube-search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.items && Array.isArray(data.items)) {
        setThumbnails(data.items.map((item: any) => ({
          url: item.snippet.thumbnails.high.url,
          title: item.snippet.title,
          videoId: item.id.videoId
        })));
        setFeedback(null);
      } else {
        console.error('Invalid data format received from API');
        setFeedback('데이터 형식이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
      setFeedback('데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };

  const handleChoice = (choice: 'Best' | 'Bad') => {
    // 실제로는 여기서 선택의 정확성을 확인해야 합니다
    // 지금은 임시로 항상 'Best'가 정답이라고 가정합니다.
    if (choice === 'Best') {
      setFeedback('맞았습니다! 👍');
    } else {
      setFeedback('틀렸습니다! 😢');
    }
  };

  return (
    <div className={styles.quizContainer}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="주제를 입력하세요"
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>검색</button>
      </div>
      
      {feedback && <p className={styles.feedback}>{feedback}</p>}
      
      {thumbnails.length > 0 ? (
        <div className={styles.thumbnailsContainer}>
          {thumbnails.map((thumbnail) => (
            <div key={thumbnail.videoId} className={styles.thumbnailItem}>
              <div className={styles.thumbnailImageContainer}>
                <Image 
                  src={thumbnail.url} 
                  alt={thumbnail.title} 
                  width={320}
                  height={180}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <p className={styles.thumbnailTitle}>{thumbnail.title}</p>
              <div className={styles.buttonContainer}>
                <button onClick={() => handleChoice('Best')} className={styles.choiceButton}>Best</button>
                <button onClick={() => handleChoice('Bad')} className={styles.choiceButton}>Bad</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.errorMessage}>검색 결과가 없습니다. 주제를 입력하세요</p>
      )}
    </div>
  );
};

export default BestThumbnailQuiz;
