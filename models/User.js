// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    fullname: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    role: {
      type: String,
      enum: ['user', 'kol', 'brand', 'company', 'admin'],
      default: 'user',
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: '',
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    website: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: ['Memilih tidak memberi tahu', 'Laki-laki', 'Perempuan', 'Lainnya'],
      default: 'Memilih tidak memberi tahu',
    },
    category: {
      type: String,
      enum: ['Tech', 'Fashion', 'Food', 'Travel', 'Lifestyle', 'Gaming', 'Beauty', 'Fitness', 'Business', 'Other'],
      default: 'Tech',
    },
    // ✅ TAMBAHAN BARU - FOLLOWERS & FOLLOWING
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    following: [{
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

export default mongoose.models.User || mongoose.model('User', UserSchema);