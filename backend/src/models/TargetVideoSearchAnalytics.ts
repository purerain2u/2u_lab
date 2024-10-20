import mongoose, { Document, Schema, Model } from 'mongoose';

interface ITargetVideoSearchAnalytics extends Document {
  pageType: string;
  date: Date;
  visitorMetrics: {
    totalVisitors: number;
    uniqueVisitors: number;
    newVisitors: number;
    returningVisitors: number;
  };
  searchMetrics: {
    totalSearches: number;
    uniqueSearches: number;
    averageSearchTime: number;
    clickedResults: number;
    savedSearches: number;
  };
  engagementMetrics: {
    averageStayDuration: number;
    bounceRate: number;
    exitRate: number;
  };
  hourlyData: Array<{
    hour: number;
    visitors: number;
    searches: number;
    clickedResults: number;
    savedSearches: number;
  }>;
  popularSearchTerms: Array<{
    term: string;
    count: number;
  }>;
  deviceTypes: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

interface ITargetVideoSearchAnalyticsModel extends Model<ITargetVideoSearchAnalytics> {
  // 여기에 정적 메서드를 추가할 수 있습니다.
}

const targetVideoSearchAnalyticsSchema = new Schema<ITargetVideoSearchAnalytics>({
  pageType: {
    type: String,
    default: 'targetVideoSearch',
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
  searchMetrics: {
    totalSearches: { type: Number, default: 0 },
    uniqueSearches: { type: Number, default: 0 },
    averageSearchTime: { type: Number, default: 0 },
    clickedResults: { type: Number, default: 0 },
    savedSearches: { type: Number, default: 0 }
  },
  engagementMetrics: {
    averageStayDuration: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 },
    exitRate: { type: Number, default: 0 }
  },
  hourlyData: [{
    hour: Number,
    visitors: Number,
    searches: Number,
    clickedResults: Number,
    savedSearches: Number
  }],
  popularSearchTerms: [{
    term: String,
    count: Number
  }],
  deviceTypes: {
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 }
  }
}, { 
  timestamps: true 
});

targetVideoSearchAnalyticsSchema.virtual('searchEfficiency').get(function(this: ITargetVideoSearchAnalytics) {
  return this.searchMetrics.totalSearches > 0
    ? (this.searchMetrics.clickedResults / this.searchMetrics.totalSearches) * 100
    : 0;
});

targetVideoSearchAnalyticsSchema.virtual('saveRate').get(function(this: ITargetVideoSearchAnalytics) {
  return this.searchMetrics.totalSearches > 0
    ? (this.searchMetrics.savedSearches / this.searchMetrics.totalSearches) * 100
    : 0;
});

targetVideoSearchAnalyticsSchema.index({ date: 1 });
targetVideoSearchAnalyticsSchema.index({ 'popularSearchTerms.term': 1 });

const TargetVideoSearchAnalytics = mongoose.model<ITargetVideoSearchAnalytics, ITargetVideoSearchAnalyticsModel>('TargetVideoSearchAnalytics', targetVideoSearchAnalyticsSchema);

export default TargetVideoSearchAnalytics;