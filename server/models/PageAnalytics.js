const mongoose = require('mongoose');

const pageAnalyticsSchema = new mongoose.Schema({
  // 페이지 유형 (예: 랜딩, 메인, 타겟 비디오 검색 등)
  pageType: {
    type: String,
    enum: ['landing', 'main', 'targetVideoSearch', 'targetSourceCollection', 'millionViewMission', 'membershipApplication', 'payment', 'about', 'services'],
    required: true,
    index: true
  },
  // 데이터 수집 날짜
  date: { type: Date, required: true, default: Date.now, index: true },
  // 총 방문자 수
  visitorCount: { type: Number, default: 0 },
  // 평균 체류 시간 (초 단위)
  averageStayDuration: { type: Number, default: 0 },
  // 클릭률 (클릭 수 / 노출 수 * 100)
  clickThroughRate: { type: Number, default: 0 },
  // 총 페이지 노출 수
  totalImpressions: { type: Number, default: 0 },
  // 총 클릭 수
  totalClicks: { type: Number, default: 0 },
  // 기기 유형별 방문자 수
  deviceTypes: {
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 }
  },

  // 랜딩 페이지 특정 메트릭
  ctaClicks: {
    signUp: { type: Number, default: 0 },  // '회원가입' 버튼 클릭 수
    learnMore: { type: Number, default: 0 },  // '더 알아보기' 버튼 클릭 수
    bounceRate: { type: Number, default: 0 },  // 이탈률 (새로 추가된 메트릭)
  },

  // 메인 페이지 특정 메트릭
  serviceClicks: {
    aiAnalysis: { type: Number, default: 0 },  // AI 분석 서비스 클릭 수
    trendPrediction: { type: Number, default: 0 },  // 트렌드 예측 서비스 클릭 수
    contentOptimization: { type: Number, default: 0 }  // 콘텐츠 최적화 서비스 클릭 수
  },

  // 타겟 비디오 검색 페이지 특정 메트릭
  searchActions: {
    performedSearches: { type: Number, default: 0 },  // 수행된 검색 수
    savedSearches: { type: Number, default: 0 },  // 저장된 검색 수
    clickedResults: { type: Number, default: 0 }  // 검색 결과 클릭 수
  },

  // 타겟 소스 수집 페이지 특정 메트릭
  sourceActions: {
    sourcesCollected: { type: Number, default: 0 },  // 수집된 소스 수
    sourcesAnalyzed: { type: Number, default: 0 },  // 분석된 소스 수
    sourcesBookmarked: { type: Number, default: 0 }  // 북마크된 소스 수
  },
  sourceMetrics: {
    averageViewCount: { type: Number, default: 0 },  // 수집된 소스의 평균 조회수
    averageLikeCount: { type: Number, default: 0 },  // 수집된 소스의 평균 좋아요 수
    averageCommentCount: { type: Number, default: 0 }  // 수집된 소스의 평균 댓글 수
  },

  // 100만뷰 따라잡기 페이지 특정 메트릭
  missionActions: {
    missionsStarted: { type: Number, default: 0 },  // 시작된 미션 수
    missionsCompleted: { type: Number, default: 0 },  // 완료된 미션 수
    averageScore: { type: Number, default: 0 }  // 평균 미션 점수
  },
  missionTypes: {
    thumbnail: {
      attempts: { type: Number, default: 0 },  // 썸네일 미션 시도 횟수
      completions: { type: Number, default: 0 },  // 썸네일 미션 완료 횟수
      averageScore: { type: Number, default: 0 }  // 썸네일 미션 평균 점수
    },
    title: {
      attempts: { type: Number, default: 0 },  // 제목 미션 시도 횟수
      completions: { type: Number, default: 0 },  // 제목 미션 완료 횟수
      averageScore: { type: Number, default: 0 }  // 제목 미션 평균 점수
    },
    script: {
      attempts: { type: Number, default: 0 },  // 대본 미션 시도 횟수
      completions: { type: Number, default: 0 },  // 대본 미션 완료 횟수
      averageScore: { type: Number, default: 0 }  // 대본 미션 평균 점수
    }
  },
  createdVideoMetrics: {
    totalVideosCreated: { type: Number, default: 0 },  // 미션을 통해 제작된 총 영상 수
    averageViewCount: { type: Number, default: 0 },  // 제작된 영상의 평균 조회수
    averageLikeCount: { type: Number, default: 0 },  // 제작된 영상의 평균 좋아요 수
    averageCommentCount: { type: Number, default: 0 },  // 제작된 영상의 평균 댓글 수
    videosReaching1MViews: { type: Number, default: 0 }  // 100만 뷰를 달성한 영상 수
  },

  // 멤버십 신청 페이지 특정 메트릭
  applicationActions: {
    applicationsStarted: { type: Number, default: 0 },  // 시작된 신청 수
    applicationsCompleted: { type: Number, default: 0 },  // 완료된 신청 수
    conversionRate: { type: Number, default: 0 }  // 전환율 (완료된 신청 / 시작된 신청 * 100)
  },

  // 결제 페이지 특정 메트릭
  paymentActions: {
    paymentsInitiated: { type: Number, default: 0 },  // 시작된 결제 수
    paymentsCompleted: { type: Number, default: 0 },  // 완료된 결제 수
    averageTransactionValue: { type: Number, default: 0 }  // 평균 거래 금액
  },

  // 회사 소개 페이지 특정 메트릭
  pageInteractions: {
    scrollDepth: {
      25: { type: Number, default: 0 },  // 25% 스크롤 도달 사용자 수
      50: { type: Number, default: 0 },  // 50% 스크롤 도달 사용자 수
      75: { type: Number, default: 0 },  // 75% 스크롤 도달 사용자 수
      100: { type: Number, default: 0 }  // 100% 스크롤 도달 사용자 수
    },
    ctaClicks: { type: Number, default: 0 }  // CTA 버튼 클릭 수
  },
  trafficSources: {
    direct: { type: Number, default: 0 },  // 직접 유입 수
    organic: { type: Number, default: 0 },  // 유기 검색 유입 수
    referral: { type: Number, default: 0 },  // 참조 유입 수
    social: { type: Number, default: 0 }  // 소셜 미디어 유입 수
  },

  // 서비스 소개 페이지 특정 메트릭
  serviceInteractions: {
    serviceClicks: {
      service1: { type: Number, default: 0 },  // 서비스1 클릭 수
      service2: { type: Number, default: 0 },  // 서비스2 클릭 수
      service3: { type: Number, default: 0 }  // 서비스3 클릭 수
    },
    inquiryFormSubmissions: { type: Number, default: 0 }  // 문의 양식 제출 수
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 인덱스 추가
pageAnalyticsSchema.index({ pageType: 1, date: 1 });

// 가상 필드: 전환율 (클릭 수 / 노출 수)
pageAnalyticsSchema.virtual('conversionRate').get(function() {
  return this.totalImpressions > 0 ? (this.totalClicks / this.totalImpressions) * 100 : 0;
});

// 스태틱 메서드: 특정 기간 동안의 페이지별 분석 데이터 조회
pageAnalyticsSchema.statics.getAnalyticsByDateRange = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$pageType',
        totalVisitors: { $sum: '$visitorCount' },
        averageStayDuration: { $avg: '$averageStayDuration' },
        totalImpressions: { $sum: '$totalImpressions' },
        totalClicks: { $sum: '$totalClicks' }
      }
    }
  ]);
};

const PageAnalytics = mongoose.model('PageAnalytics', pageAnalyticsSchema);

module.exports = PageAnalytics;