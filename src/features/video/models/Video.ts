import { Schema, model } from 'mongoose';
import type { Video } from '../types';

const VideoSchema = new Schema<Video>({
  // Define your schema fields
  title: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Add indexes
VideoSchema.index({ title: 'text' });

// Add virtuals or methods if needed
VideoSchema.virtual('shortDescription').get(function() {
  return this.description?.substring(0, 100);
});

export const Video = model<Video>(
  'Video',
  VideoSchema
);