import mongoose, { Document, Schema, Model } from 'mongoose';

interface IMembershipApplicationAnalytics extends Document {
  pageType: string;
  date: Date;
  visitorMetrics: {
    totalVisitors: number;
    uniqueVisitors: number;
    newVisitors: number;
    returningVisitors: number;
  };
  applicationMetrics: {
    totalApplicationsStarted: number;
    totalApplicationsCompleted: number;
    averageApplicationTime: number;
    conversionRate: number;
  };
  membershipTypes: {
    basic: {
      applications: number;
      conversions: number;
    };
    premium: {
      applications: number;
      conversions: number;
    };
  };
  engagementMetrics: {
    averageStayDuration: number;
    bounceRate: number;
    exitRate: number;
  };
  hourlyData: Array<{
    hour: number;
    visitors: number;
    applicationsStarted: number;
    applicationsCompleted: number;
  }>;
  deviceTypes: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

interface IMembershipApplicationAnalyticsModel extends Model<IMembershipApplicationAnalytics> {
  // 여기에 정적 메서드를 추가할 수 있습니다.
}

const membershipApplicationAnalyticsSchema = new Schema<IMembershipApplicationAnalytics>({
  pageType: {
    type: String,
    default: 'membershipApplication',
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
  applicationMetrics: {
    totalApplicationsStarted: { type: Number, default: 0 },
    totalApplicationsCompleted: { type: Number, default: 0 },
    averageApplicationTime: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 }
  },
  membershipTypes: {
    basic: { 
      applications: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 }
    },
    premium: { 
      applications: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 }
    }
  },
  engagementMetrics: {
    averageStayDuration: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 },
    exitRate: { type: Number, default: 0 }
  },
  hourlyData: [{
    hour: Number,
    visitors: Number,
    applicationsStarted: Number,
    applicationsCompleted: Number
  }],
  deviceTypes: {
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 }
  }
}, { 
  timestamps: true 
});

membershipApplicationAnalyticsSchema.virtual('overallConversionRate').get(function(this: IMembershipApplicationAnalytics) {
  return this.applicationMetrics.totalApplicationsStarted > 0
    ? (this.applicationMetrics.totalApplicationsCompleted / this.applicationMetrics.totalApplicationsStarted) * 100
    : 0;
});

membershipApplicationAnalyticsSchema.virtual('membershipTypeConversionRates').get(function(this: IMembershipApplicationAnalytics) {
  return {
    basic: this.membershipTypes.basic.applications > 0
      ? (this.membershipTypes.basic.conversions / this.membershipTypes.basic.applications) * 100
      : 0,
    premium: this.membershipTypes.premium.applications > 0
      ? (this.membershipTypes.premium.conversions / this.membershipTypes.premium.applications) * 100
      : 0
  };
});

membershipApplicationAnalyticsSchema.virtual('applicationsPerVisitor').get(function(this: IMembershipApplicationAnalytics) {
  return this.visitorMetrics.totalVisitors > 0
    ? this.applicationMetrics.totalApplicationsStarted / this.visitorMetrics.totalVisitors
    : 0;
});

membershipApplicationAnalyticsSchema.index({ date: 1 });

const MembershipApplicationAnalytics = mongoose.model<IMembershipApplicationAnalytics, IMembershipApplicationAnalyticsModel>('MembershipApplicationAnalytics', membershipApplicationAnalyticsSchema);

export default MembershipApplicationAnalytics;