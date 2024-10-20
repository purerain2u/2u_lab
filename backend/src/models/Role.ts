import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
  permissions: string[];
}

const RoleSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: String }]
});

export default mongoose.model<IRole>('Role', RoleSchema);