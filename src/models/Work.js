import mongoose from 'mongoose';

const workSchema = new mongoose.Schema({
  kol: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'in_review', 'approved', 'completed', 'cancelled'],
    default: 'pending'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  budget: {
    type: Number,
    default: 0
  },
  earnings: {
    type: Number,
    default: 0
  },
  deliverables: [{
    type: {
      type: String,
      enum: ['ig_story', 'ig_reel', 'ig_post', 'tiktok', 'youtube', 'twitter', 'other'],
      default: 'other'
    },
    title: String,
    required: {
      type: Number,
      default: 1
    },
    submitted: {
      type: Number,
      default: 0
    },
    submissions: [{
      url: String,
      caption: String,
      submittedAt: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      feedback: String
    }]
  }],
  deadline: {
    type: Date,
    required: true
  },
  engagementTarget: {
    type: Number,
    default: 0
  },
  actualEngagement: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
workSchema.index({ kol: 1, status: 1 });
workSchema.index({ brand: 1, status: 1 });
workSchema.index({ campaign: 1 });

const Work = mongoose.models.Work || mongoose.model('Work', workSchema);

export default Work;