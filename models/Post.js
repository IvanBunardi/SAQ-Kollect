// models/Post.js
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['photo', 'video', 'story'],
      required: true,
    },
    caption: {
      type: String,
      trim: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    taggedPeople: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    saves: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk optimasi query
PostSchema.index({ user: 1, createdAt: -1 });
PostSchema.index({ type: 1 });
PostSchema.index({ createdAt: -1 });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);