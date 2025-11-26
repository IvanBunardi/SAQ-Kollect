import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';



const userSchema = new mongoose.Schema({
  // Basic info
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  fullname: String,
  bio: String,
  website: String,
  profilePhoto: String,
  gender: {
    type: String,
    enum: ['Laki-laki', 'Perempuan', 'Lainnya', 'Memilih tidak memberi tahu'],
    default: 'Memilih tidak memberi tahu'
  },

  // Account type
  accountType: {
    type: String,
    enum: ['kol', 'brand'],
    required: true
  },

  // Company info (for brand)
  companyName: String,
  industry: String,

  // Social
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Settings - BARU
  language: {
    type: String,
    enum: ['en', 'id', 'es', 'fr', 'de', 'ja', 'zh'],
    default: 'en'
  },

  notificationSettings: {
    likes: { type: Boolean, default: true },
    comments: { type: Boolean, default: true },
    follows: { type: Boolean, default: true },
    mentions: { type: Boolean, default: true },
    campaigns: { type: Boolean, default: true },
    messages: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true }
  },

  isPrivate: {
    type: Boolean,
    default: false
  },

  showActivity: {
    type: Boolean,
    default: true
  },

  showEmail: {
    type: Boolean,
    default: false
  },

  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  closeFriends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Other fields
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false
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

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ accountType: 1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;