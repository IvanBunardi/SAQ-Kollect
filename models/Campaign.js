import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  brandName: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['fashion', 'beauty', 'tech', 'food', 'travel', 'lifestyle', 'gaming', 'fitness', 'other'],
    default: 'other'
  },
  budget: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  requirements: [{
    type: {
      type: String,
      enum: ['ig_story', 'ig_reel', 'ig_post', 'tiktok', 'youtube', 'twitter', 'other']
    },
    count: { type: Number, default: 1 },
    description: String
  }],
  targetAudience: {
    minFollowers: { type: Number, default: 0 },
    maxFollowers: Number,
    categories: [String],
    locations: [String],
    description: { type: String, default: '' }
  },
  deadline: {
    type: Date,
    required: true
  },
  applicationDeadline: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'open', 'pending_approval', 'in_progress', 'completed', 'rejected', 'cancelled'],
    default: 'draft'
  },
  applicants: [{
    kol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    proposal: String,
    proposedRate: Number,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }],
  selectedKOLs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxKOLs: {
    type: Number,
    default: 1
  },
  tags: [String],
  coverImage: String,
  isPublic: {
    type: Boolean,
    default: true
  },
  isDirectHire: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes
campaignSchema.index({ brand: 1, status: 1 });
campaignSchema.index({ status: 1, applicationDeadline: 1 });
campaignSchema.index({ 'selectedKOLs': 1 });

const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema);

export default Campaign;