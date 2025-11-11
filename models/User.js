// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['kol', 'company', 'admin'], default: 'kol' },
  resetToken: String,
  resetTokenExpiry: Date,
  createdAt: { type: Date, default: Date.now }
});

// Add indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

export default mongoose.models.User || mongoose.model('User', userSchema);