import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../TargetSearch.module.css';
import { SearchResult } from '../utils/youtubeApi';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { ko } from 'date-fns/locale';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

interface VideoData {
  viewCount: string | number;
  likeCount: string | number;
  // 다른 필요한 속성들도 여기에 추가
}

interface VideoAnalysisPopupProps {
  videoData: SearchResult;
  onClose: () => void;
}

const VideoAnalysisPopup: React.FC<VideoAnalysisPopupProps> = ({ videoData, onClose }) => {
  const [showGraph, setShowGraph] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [channelData, setChannelData] = useState<any>(null);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const response = await axios.get('/api/youtube/channel', {
          params: {
            channelTitle: videoData.channelTitle
          }
        });
        console.log('API 응답:', response.data);

        const channelStats = response.data.statistics || {};
        const viewCount = parseInt(channelStats.viewCount || '0', 10);
        const videoCount = parseInt(channelStats.videoCount || '0', 10);
        
        console.log('파싱된 데이터:', { viewCount, videoCount });

        setChannelData({
          ...response.data,
          statistics: {
            viewCount,
            videoCount,
            averageViews: videoCount > 0 ? Math.round(viewCount / videoCount) : 0
          }
        });
      } catch (error) {
        console.error('채널 데이터를 가져오는 데 실패했습니다:', error);
      }
    };

    fetchChannelData();
  }, [videoData.channelTitle]);

  useEffect(() => {
    if (showGraph) {
      const interval = setInterval(() => {
        setAnimationProgress(prev => {
          if (prev >= 1) {
            clearInterval(interval);
            return 1;
          }
          return prev + 0.01;
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [showGraph]);

  const getAppropriateUnit = (value: number) => {
    if (value >= 100000000) return { divisor: 100000000, unit: '억' };
    if (value >= 10000) return { divisor: 10000, unit: '만' };
    return { divisor: 1, unit: '' };
  };

  const videoViewCount = typeof videoData.viewCount === 'string' ? parseInt(videoData.viewCount, 10) : videoData.viewCount || 0;
  const videoLikeCount = typeof videoData.likeCount === 'string' ? parseInt(videoData.likeCount, 10) : videoData.likeCount || 0;

  const { divisor, unit } = getAppropriateUnit(videoViewCount);

  const generateChartData = () => {
    const publishDate = new Date(videoData.publishedAt);
    const today = new Date();
    const daysSincePublish = Math.floor((today.getTime() - publishDate.getTime()) / (1000 * 3600 * 24));
    
    const labels = [];
    const data = [];
    for (let i = 0; i <= daysSincePublish; i++) {
      const date = new Date(publishDate.getTime() + i * 24 * 60 * 60 * 1000);
      labels.push(date);
      data.push((videoViewCount * (1 - Math.exp(-5 * i / daysSincePublish)) / divisor) * animationProgress);
    }
    return { labels, data };
  };

  const { labels, data } = generateChartData();

  const chartData = {
    labels,
    datasets: [
      {
        label: '조회수',
        data,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointRadius: 0,
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '영상 조회수 성장 추정'
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MM/dd'
          }
        },
        title: {
          display: true,
          text: '날짜'
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6
        },
        adapters: {
          date: {
            locale: ko
          }
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: `조회수 (${unit})`
        },
        ticks: {
          callback: function(value) {
            return value + unit;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const averageWatchTime = 2; // 분
  const totalWatchTime = videoViewCount * averageWatchTime;

  const subscriberIncrease = Math.round(videoViewCount * 0.005);

  const channelViewCount = channelData?.statistics?.viewCount ? parseInt(channelData.statistics.viewCount, 10) : 0;
  const channelVideoCount = channelData?.statistics?.videoCount ? parseInt(channelData.statistics.videoCount, 10) : 1;
  const channelAverageViews = channelVideoCount > 0 ? Math.round(channelViewCount / channelVideoCount) : 0;

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <h2 className={styles.popupTitle}>영상 분석</h2>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <div className={styles.videoInfo}>
          <div className={styles.thumbnailWrapper}>
            <Image 
              src={videoData.thumbnailUrl} 
              alt={videoData.title} 
              width={400}
              height={225}
              layout="responsive"
              className={styles.thumbnail}
            />
          </div>
          <div className={styles.videoDetails}>
            <h3 className={styles.videoTitle}>{videoData.title}</h3>
            <p className={styles.channelTitle}>{videoData.channelTitle}</p>
            <p className={styles.description}>{videoData.description}</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <h4>기여도</h4>
            <p className={styles.statValue}>{videoData.contribution || 'N/A'}</p>
          </div>
          <div className={styles.statItem}>
            <h4>성과도</h4>
            <p className={styles.statValue}>{videoData.performance || 'N/A'}</p>
          </div>
          <div className={styles.statItem}>
            <h4>조회수</h4>
            <p className={styles.statValue}>{videoViewCount.toLocaleString()}</p>
          </div>
          <div className={styles.statItem}>
            <h4>좋아요</h4>
            <p className={styles.statValue}>{videoLikeCount.toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.chart}>
          <h4>영상 조회수 성장 추정</h4>
          {!showGraph ? (
            <div className={styles.graphButtonContainer}>
              <button className={styles.showGraphButton} onClick={() => setShowGraph(true)}>
                그래프 확인
              </button>
            </div>
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>

        <div className={styles.additionalStats}>
          <div>
            <h4>총 시청 시간</h4>
            <p>{Math.round(totalWatchTime / 60)} 시간</p>
          </div>
          <div>
            <h4>구독자수 증가 추정</h4>
            <p>{subscriberIncrease} 명</p>
          </div>
          <div>
            <h4>채널 누적 조회수</h4>
            <p>{channelData?.statistics?.viewCount?.toLocaleString() || '0'} 회</p>
          </div>
          <div>
            <h4>채널 평균 조회수</h4>
            <p>{channelData?.statistics?.averageViews?.toLocaleString() || '0'} 회</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAnalysisPopup;