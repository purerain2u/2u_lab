import mongoose, { Document, Schema, Model } from 'mongoose';

// PageAnalytics 인터페이스 정의
interface IPageAnalytics extends Document {
  pageType: string;
  date: Date;
  visitorCount: number;
  averageStayDuration: number;
  clickThroughRate: number;
  totalImpressions: number;
  totalClicks: number;
  deviceTypes: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  ctaClicks: {
    signUp: number;
    learnMore: number;
    bounceRate: number;
  };
  serviceClicks: {
    aiAnalysis: number;
    trendPrediction: number;
    contentOptimization: number;
  };
  searchActions: {
    performedSearches: number;
    savedSearches: number;
    clickedResults: number;
  };
  sourceActions: {
    sourcesCollected: number;
    sourcesAnalyzed: number;
    sourcesBookmarked: number;
  };
  sourceMetrics: {
    averageViewCount: number;
    averageLikeCount: number;
    averageCommentCount: number;
  };
  missionActions: {
    missionsStarted: number;
    missionsCompleted: number;
    averageScore: number;
  };
  missionTypes: {
    thumbnail: {
      attempts: number;
      completions: number;
      averageScore: number;
    };
    title: {
      attempts: number;
      completions: number;
      averageScore: number;
    };
    script: {
      attempts: number;
      completions: number;
      averageScore: number;
    };
  };
  createdVideoMetrics: {
    totalVideosCreated: number;
    averageViewCount: number;
    averageLikeCount: number;
    averageCommentCount: number;
    videosReaching1MViews: number;
  };
  applicationActions: {
    applicationsStarted: number;
    applicationsCompleted: number;
    conversionRate: number;
  };
  paymentActions: {
    paymentsInitiated: number;
    paymentsCompleted: number;
    averageTransactionValue: number;
  };
  pageInteractions: {
    scrollDepth: {
      25: number;
      50: number;
      75: number;
      100: number;
    };
    ctaClicks: number;
  };
  trafficSources: {
    direct: number;
    organic: number;
    referral: number;
    social: number;
  };
  serviceInteractions: {
    serviceClicks: {
      service1: number;
      service2: number;
      service3: number;
    };
    inquiryFormSubmissions: number;
  };
  conversionRate: number;
}

// PageAnalytics 모델 인터페이스 정의
interface IPageAnalyticsModel extends Model<IPageAnalytics> {
  getAnalyticsByDateRange(startDate: Date, endDate: Date): Promise<any>;
}

// PageAnalytics 스키마 정의
const pageAnalyticsSchema = new Schema<IPageAnalytics>({
  pageType: {
    type: String,
    enum: ['landing', 'main', 'targetVideoSearch', 'targetSourceCollection', 'millionViewMission', 'membershipApplication', 'payment', 'about', 'services'],
    required: true,
    index: true
  },
  date: { type: Date, required: true, default: Date.now, index: true },
  visitorCount: { type: Number, default: 0 },
  averageStayDuration: { type: Number, default: 0 },
  clickThroughRate: { type: Number, default: 0 },
  totalImpressions: { type: Number, default: 0 },
  totalClicks: { type: Number, default: 0 },
  deviceTypes: {
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 }
  },
  ctaClicks: {
    signUp: { type: Number, default: 0 },
    learnMore: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 },
  },
  serviceClicks: {
    aiAnalysis: { type: Number, default: 0 },
    trendPrediction: { type: Number, default: 0 },
    contentOptimization: { type: Number, default: 0 }
  },
  searchActions: {
    performedSearches: { type: Number, default: 0 },
    savedSearches: { type: Number, default: 0 },
    clickedResults: { type: Number, default: 0 }
  },
  sourceActions: {
    sourcesCollected: { type: Number, default: 0 },
    sourcesAnalyzed: { type: Number, default: 0 },
    sourcesBookmarked: { type: Number, default: 0 }
  },
  sourceMetrics: {
    averageViewCount: { type: Number, default: 0 },
    averageLikeCount: { type: Number, default: 0 },
    averageCommentCount: { type: Number, default: 0 }
  },
  missionActions: {
    missionsStarted: { type: Number, default: 0 },
    missionsCompleted: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 }
  },
  missionTypes: {
    thumbnail: {
      attempts: { type: Number, default: 0 },
      completions: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 }
    },
    title: {
      attempts: { type: Number, default: 0 },
      completions: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 }
    },
    script: {
      attempts: { type: Number, default: 0 },
      completions: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 }
    }
  },
  createdVideoMetrics: {
    totalVideosCreated: { type: Number, default: 0 },
    averageViewCount: { type: Number, default: 0 },
    averageLikeCount: { type: Number, default: 0 },
    averageCommentCount: { type: Number, default: 0 },
    videosReaching1MViews: { type: Number, default: 0 }
  },
  applicationActions: {
    applicationsStarted: { type: Number, default: 0 },
    applicationsCompleted: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 }
  },
  paymentActions: {
    paymentsInitiated: { type: Number, default: 0 },
    paymentsCompleted: { type: Number, default: 0 },
    averageTransactionValue: { type: Number, default: 0 }
  },
  pageInteractions: {
    scrollDepth: {
      25: { type: Number, default: 0 },
      50: { type: Number, default: 0 },
      75: { type: Number, default: 0 },
      100: { type: Number, default: 0 }
    },
    ctaClicks: { type: Number, default: 0 }
  },
  trafficSources: {
    direct: { type: Number, default: 0 },
    organic: { type: Number, default: 0 },
    referral: { type: Number, default: 0 },
    social: { type: Number, default: 0 }
  },
  serviceInteractions: {
    serviceClicks: {
      service1: { type: Number, default: 0 },
      service2: { type: Number, default: 0 },
      service3: { type: Number, default: 0 }
    },
    inquiryFormSubmissions: { type: Number, default: 0 }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 인덱스 생성
pageAnalyticsSchema.index({ pageType: 1, date: 1 });

// 가상 필드: 전환율 계산
pageAnalyticsSchema.virtual('conversionRate').get(function(this: IPageAnalytics) {
  return this.totalImpressions > 0 ? (this.totalClicks / this.totalImpressions) * 100 : 0;
});

// 정적 메서드: 날짜 범위에 따른 분석 데이터 가져오기
pageAnalyticsSchema.statics.getAnalyticsByDateRange = function(startDate: Date, endDate: Date) {
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

// PageAnalytics 모델 생성
const PageAnalytics = mongoose.model<IPageAnalytics, IPageAnalyticsModel>('PageAnalytics', pageAnalyticsSchema);

export default PageAnalytics;
