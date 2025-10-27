// models/Bookmark.js
import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  kol_id: { type: mongoose.Schema.Types.ObjectId, ref: 'KOL', required: true },
  campaign_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Bookmark || mongoose.model('Bookmark', bookmarkSchema);