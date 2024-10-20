import mongoose, { Schema, Document } from 'mongoose';

export interface IPageVisit extends Document {
  userId: mongoose.Types.ObjectId | null;
  pageType: string;
  timestamp: Date;
}

const pageVisitSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  pageType: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IPageVisit>('PageVisit', pageVisitSchema);