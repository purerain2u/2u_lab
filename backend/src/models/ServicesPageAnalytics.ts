import mongoose, { Document, Schema, Model } from 'mongoose';

interface IServicesPageAnalytics extends Document {
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
  serviceInteractions: {
    service1: { views: number; clicks: number };
    service2: { views: number; clicks: number };
    service3: { views: number; clicks: number };
  };
  ctaPerformance: {
    learnMore: { impressions: number; clicks: number };
    getStarted: { impressions: number; clicks: number };
  };
  inquiryMetrics: {
    formViews: number;
    formSubmissions: number;
  };
  hourlyData: Array<{
    hour: number;
    pageViews: number;
    uniquePageViews: number;
    serviceClicks: {
      service1: number;
      service2: number;
      service3: number;
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
  serviceClickRates: {
    service1: number;
    service2: number;
    service3: number;
  };
  ctaClickRates: {
    learnMore: number;
    getStarted: number;
  };
  inquiryConversionRate: number;
}

interface IServicesPageAnalyticsModel extends Model<IServicesPageAnalytics> {
  // 여기에 정적 메서드를 추가할 수 있습니다.
}

const servicesPageAnalyticsSchema = new Schema<IServicesPageAnalytics>({
  pageType: {
    type: String,
    default: 'services',
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
  serviceInteractions: {
    service1: { views: { type: Number, default: 0 }, clicks: { type: Number, default: 0 } },
    service2: { views: { type: Number, default: 0 }, clicks: { type: Number, default: 0 } },
    service3: { views: { type: Number, default: 0 }, clicks: { type: Number, default: 0 } }
  },
  ctaPerformance: {
    learnMore: { 
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 }
    },
    getStarted: { 
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 }
    }
  },
  inquiryMetrics: {
    formViews: { type: Number, default: 0 },
    formSubmissions: { type: Number, default: 0 }
  },
  hourlyData: [{
    hour: Number,
    pageViews: Number,
    uniquePageViews: Number,
    serviceClicks: {
      service1: Number,
      service2: Number,
      service3: Number
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

servicesPageAnalyticsSchema.virtual('serviceClickRates').get(function(this: IServicesPageAnalytics) {
  return {
    service1: this.serviceInteractions.service1.views > 0
      ? (this.serviceInteractions.service1.clicks / this.serviceInteractions.service1.views) * 100
      : 0,
    service2: this.serviceInteractions.service2.views > 0
      ? (this.serviceInteractions.service2.clicks / this.serviceInteractions.service2.views) * 100
      : 0,
    service3: this.serviceInteractions.service3.views > 0
      ? (this.serviceInteractions.service3.clicks / this.serviceInteractions.service3.views) * 100
      : 0
  };
});

servicesPageAnalyticsSchema.virtual('ctaClickRates').get(function(this: IServicesPageAnalytics) {
  return {
    learnMore: this.ctaPerformance.learnMore.impressions > 0
      ? (this.ctaPerformance.learnMore.clicks / this.ctaPerformance.learnMore.impressions) * 100
      : 0,
    getStarted: this.ctaPerformance.getStarted.impressions > 0
      ? (this.ctaPerformance.getStarted.clicks / this.ctaPerformance.getStarted.impressions) * 100
      : 0
  };
});

servicesPageAnalyticsSchema.virtual('inquiryConversionRate').get(function(this: IServicesPageAnalytics) {
  return this.inquiryMetrics.formViews > 0
    ? (this.inquiryMetrics.formSubmissions / this.inquiryMetrics.formViews) * 100
    : 0;
});

servicesPageAnalyticsSchema.index({ date: 1 });

const ServicesPageAnalytics = mongoose.model<IServicesPageAnalytics, IServicesPageAnalyticsModel>('ServicesPageAnalytics', servicesPageAnalyticsSchema);

export default ServicesPageAnalytics;
````

2. `src/models/TargetSourceCollectionAnalytics.ts`:
