import mongoose, { Document, Schema, Model } from 'mongoose';

interface ILandingPageAnalytics extends Document {
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
  ctaPerformance: {
    signUp: {
      impressions: number;
      clicks: number;
    };
    learnMore: {
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
    ctaClicks: {
      signUp: number;
      learnMore: number;
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

interface ILandingPageAnalyticsModel extends Model<ILandingPageAnalytics> {
  // 여기에 정적 메서드를 추가할 수 있습니다.
}

const landingPageAnalyticsSchema = new Schema<ILandingPageAnalytics>({
  date: { type: Date, required: true, default: Date.now },
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
  ctaPerformance: {
    signUp: { 
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 }
    },
    learnMore: { 
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
    ctaClicks: {
      signUp: Number,
      learnMore: Number
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

const LandingPageAnalytics = mongoose.model<ILandingPageAnalytics, ILandingPageAnalyticsModel>('LandingPageAnalytics', landingPageAnalyticsSchema);

export default LandingPageAnalytics;