import mongoose from 'mongoose';

const deliverableSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['ig_story', 'ig_reel', 'ig_post', 'tiktok', 'youtube', 'twitter', 'other'],
    required: true
  },
  title: {
    type: String,
    default: ''
  },
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
    mediaUrl: String,
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
});

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
    enum: ['pending', 'active', 'in_review', 'revision', 'completed', 'paid', 'cancelled'],
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
    required: true
  },
  earnings: {
    type: Number,
    default: 0
  },
  deliverables: [deliverableSchema],
  deadline: {
    type: Date,
    required: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  paidAt: Date,
  notes: {
    type: String,
    default: ''
  },
  engagementTarget: {
    type: Number,
    default: 0
  },
  actualEngagement: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate progress automatically
workSchema.methods.calculateProgress = function() {
  if (this.deliverables.length === 0) return 0;
  
  let totalRequired = 0;
  let totalSubmitted = 0;
  
  this.deliverables.forEach(d => {
    totalRequired += d.required;
    totalSubmitted += Math.min(d.submitted, d.required);
  });
  
  return totalRequired > 0 ? Math.round((totalSubmitted / totalRequired) * 100) : 0;
};

// Indexes
workSchema.index({ kol: 1, status: 1 });
workSchema.index({ brand: 1, status: 1 });
workSchema.index({ campaign: 1 });
workSchema.index({ deadline: 1 });

const Work = mongoose.models.Work || mongoose.model('Work', workSchema);

export default Work;