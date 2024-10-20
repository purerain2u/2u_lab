import mongoose, { Document, Schema, Model } from 'mongoose';

interface ITargetSourceCollectionAnalytics extends Document {
  pageType: string;
  date: Date;
  visitorMetrics: {
    totalVisitors: number;
    uniqueVisitors: number;
    newVisitors: number;
    returningVisitors: number;
  };
  collectionMetrics: {
    totalSourcesCollected: number;
    uniqueSourcesCollected: number;
    averageCollectionTime: number;
    sourcesTagged: number;
    sourcesShared: number;
  };
  engagementMetrics: {
    averageStayDuration: number;
    bounceRate: number;
    exitRate: number;
  };
  hourlyData: Array<{
    hour: number;
    visitors: number;
    sourcesCollected: number;
    sourcesTagged: number;
    sourcesShared: number;
  }>;
  popularSourceTypes: Array<{
    type: string;
    count: number;
  }>;
  deviceTypes: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

interface ITargetSourceCollectionAnalyticsModel extends Model<ITargetSourceCollectionAnalytics> {
  // 여기에 정적 메서드를 추가할 수 있습니다.
}

const targetSourceCollectionAnalyticsSchema = new Schema<ITargetSourceCollectionAnalytics>({
  pageType: {
    type: String,
    default: 'targetSourceCollection',
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
  collectionMetrics: {
    totalSourcesCollected: { type: Number, default: 0 },
    uniqueSourcesCollected: { type: Number, default: 0 },
    averageCollectionTime: { type: Number, default: 0 },
    sourcesTagged: { type: Number, default: 0 },
    sourcesShared: { type: Number, default: 0 }
  },
  engagementMetrics: {
    averageStayDuration: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 },
    exitRate: { type: Number, default: 0 }
  },
  hourlyData: [{
    hour: Number,
    visitors: Number,
    sourcesCollected: Number,
    sourcesTagged: Number,
    sourcesShared: Number
  }],
  popularSourceTypes: [{
    type: String,
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

targetSourceCollectionAnalyticsSchema.virtual('collectionEfficiency').get(function(this: ITargetSourceCollectionAnalytics) {
  return this.visitorMetrics.totalVisitors > 0
    ? (this.collectionMetrics.totalSourcesCollected / this.visitorMetrics.totalVisitors)
    : 0;
});

targetSourceCollectionAnalyticsSchema.virtual('taggingRate').get(function(this: ITargetSourceCollectionAnalytics) {
  return this.collectionMetrics.totalSourcesCollected > 0
    ? (this.collectionMetrics.sourcesTagged / this.collectionMetrics.totalSourcesCollected) * 100
    : 0;
});

targetSourceCollectionAnalyticsSchema.virtual('sharingRate').get(function(this: ITargetSourceCollectionAnalytics) {
  return this.collectionMetrics.totalSourcesCollected > 0
    ? (this.collectionMetrics.sourcesShared / this.collectionMetrics.totalSourcesCollected) * 100
    : 0;
});

targetSourceCollectionAnalyticsSchema.index({ date: 1 });
targetSourceCollectionAnalyticsSchema.index({ 'popularSourceTypes.type': 1 });

const TargetSourceCollectionAnalytics = mongoose.model<ITargetSourceCollectionAnalytics, ITargetSourceCollectionAnalyticsModel>('TargetSourceCollectionAnalytics', targetSourceCollectionAnalyticsSchema);

export default TargetSourceCollectionAnalytics;