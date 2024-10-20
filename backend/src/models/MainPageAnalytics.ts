import mongoose, { Document, Schema, Model } from 'mongoose';

interface IMainPageAnalytics extends Document {
  pageType: string;
  date: Date;
  visitorMetrics: {
    totalVisitors: number;
    uniqueVisitors: number;
    newVisitors: number;
    returningVisitors: number;
  };
  engagementMetrics: {
    averageStayDuration: number;
    bounceRate: number;
    exitRate: number;
  };
  serviceInteractions: {
    aiAnalysis: {
      impressions: number;
      clicks: number;
    };
    trendPrediction: {
      impressions: number;
      clicks: number;
    };
    contentOptimization: {
      impressions: number;
      clicks: number;
    };
  };
  totalImpressions: number;
  totalClicks: number;
  clickThroughRate: number;
  hourlyData: Array<{
    hour: number;
    visitors: number;
    averageStayDuration: number;
    serviceClicks: {
      aiAnalysis: number;
      trendPrediction: number;
      contentOptimization: number;
    };
  }>;
  userJourneys: {
    landingToAiAnalysis: number;
    landingToTrendPrediction: number;
    landingToContentOptimization: number;
  };
  deviceTypes: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

interface IMainPageAnalyticsModel extends Model<IMainPageAnalytics> {
  // 여기에 정적 메서드를 추가할 수 있습니다.
}

const mainPageAnalyticsSchema = new Schema<IMainPageAnalytics>({
  pageType: {
    type: String,
    default: 'main',
    immutable: true
  },
  date: { 
    type: Date, 
    required: true, 
    default: Date.now 
  },
  visitorMetrics: {
    totalVisitors: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    newVisitors: { type: Number, default: 0 },
    returningVisitors: { type: Number, default: 0 }
  },
  engagementMetrics: {
    averageStayDuration: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 },
    exitRate: { type: Number, default: 0 }
  },
  serviceInteractions: {
    aiAnalysis: { 
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 }
    },
    trendPrediction: { 
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 }
    },
    contentOptimization: { 
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 }
    }
  },
  totalImpressions: { type: Number, default: 0 },
  totalClicks: { type: Number, default: 0 },
  clickThroughRate: { type: Number, default: 0 },
  hourlyData: [{
    hour: Number,
    visitors: Number,
    averageStayDuration: Number,
    serviceClicks: {
      aiAnalysis: Number,
      trendPrediction: Number,
      contentOptimization: Number
    }
  }],
  userJourneys: {
    landingToAiAnalysis: { type: Number, default: 0 },
    landingToTrendPrediction: { type: Number, default: 0 },
    landingToContentOptimization: { type: Number, default: 0 }
  },
  deviceTypes: {
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 }
  }
}, { 
  timestamps: true 
});

mainPageAnalyticsSchema.virtual('clickThroughRates').get(function(this: IMainPageAnalytics) {
  return {
    aiAnalysis: this.serviceInteractions.aiAnalysis.impressions > 0 
      ? (this.serviceInteractions.aiAnalysis.clicks / this.serviceInteractions.aiAnalysis.impressions) * 100 
      : 0,
    trendPrediction: this.serviceInteractions.trendPrediction.impressions > 0 
      ? (this.serviceInteractions.trendPrediction.clicks / this.serviceInteractions.trendPrediction.impressions) * 100 
      : 0,
    contentOptimization: this.serviceInteractions.contentOptimization.impressions > 0 
      ? (this.serviceInteractions.contentOptimization.clicks / this.serviceInteractions.contentOptimization.impressions) * 100 
      : 0
  };
});

mainPageAnalyticsSchema.index({ date: 1 });

const MainPageAnalytics = mongoose.model<IMainPageAnalytics, IMainPageAnalyticsModel>('MainPageAnalytics', mainPageAnalyticsSchema);

export default MainPageAnalytics;