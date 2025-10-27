// models/Campaign.js
import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  id_brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  judul: { type: String, required: true },
  deskripsi: { type: String, required: true },
  tujuan: String,
  platform: [String],
  kategori: String,
  status: { type: String, enum: ['draft', 'active', 'completed', 'cancelled'], default: 'draft' },
  timeline: {
    mulai: Date,
    selesai: Date
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema);