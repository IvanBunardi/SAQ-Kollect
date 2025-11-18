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
      enum: ['user', 'kol', 'brand', 'admin'],
      default: 'user',
    },
    profilePhoto: {
      type: String, // Base64 string or URL
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Prevent model recompilation in development
export default mongoose.models.User || mongoose.model('User', UserSchema);