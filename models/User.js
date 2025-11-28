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
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  fullname: {
    type: String,
    required: true,
    trim: true
  },
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
    required: false,
    default: 'kol'
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

  // Settings - Language
  language: {
    type: String,
    enum: ['en', 'id', 'es', 'fr', 'de', 'ja', 'zh'],
    default: 'en'
  },

  // Settings - Notifications
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

  // Settings - Privacy
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

  // Settings - Blocked & Close Friends
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  closeFriends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Account status
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  strictPopulate: false
});

// ✅ Hash password before save (ONLY place where hashing happens)
userSchema.pre('save', async function(next) {
  // Skip if password not modified
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw new Error('Password comparison failed');
  }
};

// Indexes untuk performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ accountType: 1 });
userSchema.index({ createdAt: -1 });

// Prevent duplicate model creation
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;