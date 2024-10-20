import mongoose, { Document, Schema, Model } from 'mongoose';

interface IAboutPageAnalytics extends Document {
  pageType: string;
  date: Date;
  visitorMetrics: {
    totalPageViews: number;
    uniquePageViews: number;
    newVisitors: number;
    returningVisitors: number;
  };
  engagementMetrics: {
    averageStayDuration: number;
    bounceRate: number;
    exitRate: number;
  };
  scrollDepth: {
    25: number;
    50: number;
    75: number;
    100: number;
  };
  contentInteractions: {
    videoPlays: number;
    imageEnlargements: number;
    linkClicks: number;
  };
  ctaPerformance: {
    contactUs: {
      impressions: number;
      clicks: number;
    };
    joinTeam: {
      impressions: number;
      clicks: number;
    };
  };
  hourlyData: Array<{
    hour: number;
    pageViews: number;
    uniquePageViews: number;
    averageStayDuration: number;
    scrollDepth: {
      25: number;
      50: number;
      75: number;
      100: number;
    };
  }>;
  trafficSources: {
    direct: number;
    organic: number;
    referral: number;
    social: number;
  };
  deviceTypes: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

interface IAboutPageAnalyticsModel extends Model<IAboutPageAnalytics> {
  // 여기에 정적 메서드를 추가할 수 있습니다.
}

const aboutPageAnalyticsSchema = new Schema<IAboutPageAnalytics>({
  pageType: {
    type: String,
    default: 'about',
    immutable: true
  },
  date: { 
    type: Date, 
    required: true, 
    default: Date.now 
  },
  visitorMetrics: {
    totalPageViews: { type: Number, default: 0 },
    uniquePageViews: { type: Number, default: 0 },
    newVisitors: { type: Number, default: 0 },
    returningVisitors: { type: Number, default: 0 }
  },
  engagementMetrics: {
    averageStayDuration: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 },
    exitRate: { type: Number, default: 0 }
  },
  scrollDepth: {
    25: { type: Number, default: 0 },
    50: { type: Number, default: 0 },
    75: { type: Number, default: 0 },
    100: { type: Number, default: 0 }
  },
  contentInteractions: {
    videoPlays: { type: Number, default: 0 },
    imageEnlargements: { type: Number, default: 0 },
    linkClicks: { type: Number, default: 0 }
  },
  ctaPerformance: {
    contactUs: { 
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 }
    },
    joinTeam: { 
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 }
    }
  },
  hourlyData: [{
    hour: Number,
    pageViews: Number,
    uniquePageViews: Number,
    averageStayDuration: Number,
    scrollDepth: {
      25: Number,
      50: Number,
      75: Number,
      100: Number
    }
  }],
  trafficSources: {
    direct: { type: Number, default: 0 },
    organic: { type: Number, default: 0 },
    referral: { type: Number, default: 0 },
    social: { type: Number, default: 0 }
  },
  deviceTypes: {
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 }
  }
}, { 
  timestamps: true 
});

aboutPageAnalyticsSchema.virtual('ctaClickRates').get(function(this: IAboutPageAnalytics) {
  return {
    contactUs: this.ctaPerformance.contactUs.impressions > 0
      ? (this.ctaPerformance.contactUs.clicks / this.ctaPerformance.contactUs.impressions) * 100
      : 0,
    joinTeam: this.ctaPerformance.joinTeam.impressions > 0
      ? (this.ctaPerformance.joinTeam.clicks / this.ctaPerformance.joinTeam.impressions) * 100
      : 0
  };
});

aboutPageAnalyticsSchema.virtual('averageScrollDepth').get(function(this: IAboutPageAnalytics) {
  const totalDepth = (this.scrollDepth[25] * 25 + this.scrollDepth[50] * 50 + 
                      this.scrollDepth[75] * 75 + this.scrollDepth[100] * 100);
  const totalScrolls = this.scrollDepth[25] + this.scrollDepth[50] + 
                       this.scrollDepth[75] + this.scrollDepth[100];
  return totalScrolls > 0 ? totalDepth / totalScrolls : 0;
});

aboutPageAnalyticsSchema.index({ date: 1 });

const AboutPageAnalytics = mongoose.model<IAboutPageAnalytics, IAboutPageAnalyticsModel>('AboutPageAnalytics', aboutPageAnalyticsSchema);

export default AboutPageAnalytics;