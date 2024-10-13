import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface SearchResult {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  subscriberCount: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  totalVideos: number;
  publishedAt: string;
  contribution: string;
  performance: string;
  channelTitle: string;
  description: string;
}

const calculateContribution = (
    viewCount: number,
    likeCount: number,
    subscriberCount: number,
    publishedAt: string
  ): string => {
    const daysSincePublished = Math.max(1, (Date.now() - new Date(publishedAt).getTime()) / (1000 * 3600 * 24));
    const score = subscriberCount === 0 ? 0 : ((viewCount * 0.7 + likeCount * 0.3) / (subscriberCount * Math.sqrt(daysSincePublished))) * 1000;
  
    if (score > 10) return 'Best';
    if (score > 5) return 'Good';
    if (score > 1) return 'Normal';
    if (score > 0.1) return 'Bad';
    return 'Worst';
  };
  
  const calculatePerformance = (likeCount: number, commentCount: number, viewCount: number): string => {
    const score = viewCount === 0 ? 0 : (likeCount * 0.4 + commentCount * 0.6) / viewCount;
  
    if (score > 0.1) return 'Best';
    if (score > 0.05) return 'Good';
    if (score > 0.01) return 'Normal';
    if (score > 0.005) return 'Bad';
    return 'Worst';
  };

export const searchYouTube = async (query: string): Promise<SearchResult[]> => {
  if (!API_KEY) {
    throw new Error('YouTube API 키가 설정되지 않았습니다.');
  }

  try {
    const searchResponse = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        type: 'video',
        q: query,
        key: API_KEY,
        maxResults: 50
      }
    });

    const videoIds = searchResponse.data.items.map((item: any) => item.id.videoId).join(',');

    const videoResponse = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'statistics,snippet',
        id: videoIds,
        key: API_KEY
      }
    });

    const channelIds = videoResponse.data.items.map((item: any) => item.snippet.channelId).join(',');

    const channelResponse = await axios.get(`${BASE_URL}/channels`, {
      params: {
        part: 'statistics',
        id: channelIds,
        key: API_KEY
      }
    });

    return videoResponse.data.items.map((item: any, index: number) => {
      const channelStats = channelResponse.data.items[index]?.statistics || {};
      const viewCount = parseInt(item.statistics.viewCount) || 0;
      const likeCount = parseInt(item.statistics.likeCount) || 0;
      const commentCount = parseInt(item.statistics.commentCount) || 0;
      const subscriberCount = parseInt(channelStats.subscriberCount) || 0;
      const publishedAt = item.snippet.publishedAt;

      return {
        videoId: item.id,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        subscriberCount,
        viewCount,
        likeCount,
        commentCount,
        totalVideos: parseInt(channelStats.videoCount) || 0,
        publishedAt: new Date(publishedAt).toLocaleDateString(),
        contribution: calculateContribution(viewCount, likeCount, subscriberCount, publishedAt),
        performance: calculatePerformance(likeCount, commentCount, viewCount),
        channelTitle: item.snippet.channelTitle,
        description: item.snippet.description
      };
    });
  } catch (error) {
    console.error('YouTube API 호출 중 오류 발생:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('응답 데이터:', error.response.data);
      console.error('응답 상태:', error.response.status);
      console.error('응답 헤더:', error.response.headers);
    }
    throw new Error('YouTube 데이터를 가져오는데 실패했습니다. 다시 시도해 주세요.');
  }
};

export const getRandomVideos = async (): Promise<SearchResult[]> => {
  return [
    {
      videoId: 'random1',
      title: '랜덤 비디오 1',
      thumbnailUrl: 'https://example.com/thumbnail1.jpg',
      subscriberCount: 10000,
      viewCount: 50000,
      likeCount: 1000,
      commentCount: 500,
      totalVideos: 100,
      publishedAt: '2023-01-01',
      contribution: 'High',
      performance: 'Good',
      channelTitle: '랜덤 채널 1',
      description: '이것은 랜덤 비디오 1의 설명입니다.'
    },
    // ... 더 많은 랜덤 비디오 데이터 추가
  ];
};