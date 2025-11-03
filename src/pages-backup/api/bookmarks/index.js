// pages/api/bookmarks/index.js
import dbConnect from '../../../lib/mongodb';
import Bookmark from '../../../models/Bookmark';
import Campaign from '../../../models/Campaign';
import KOL from '../../../models/KOL';
import { authMiddleware } from '../../../middleware/auth';

async function handler(req, res) {
  await dbConnect();

  // GET - Ambil semua bookmark
  if (req.method === 'GET') {
    try {
      const { kol_id, campaign_id, page = 1, limit = 10 } = req.query;

      const query = {};
      if (kol_id) query.kol_id = kol_id;
      if (campaign_id) query.campaign_id = campaign_id;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const bookmarks = await Bookmark.find(query)
        .populate({
          path: 'campaign_id',
          populate: {
            path: 'id_brand',
            select: 'nama industri'
          }
        })
        .populate('kol_id', 'email followers engagement niche tarif rating')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Bookmark.countDocuments(query);

      return res.status(200).json({
        success: true,
        data: {
          bookmarks,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit))
          }
        }
      });
    } catch (error) {
      console.error('Get bookmarks error:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server'
      });
    }
  }

  // POST - Tambah bookmark
  if (req.method === 'POST') {
    try {
      const { kol_id, campaign_id } = req.body;

      // Validasi input
      if (!kol_id || !campaign_id) {
        return res.status(400).json({
          success: false,
          message: 'KOL ID dan Campaign ID harus diisi'
        });
      }

      // Verifikasi KOL exists
      const kol = await KOL.findById(kol_id);
      if (!kol) {
        return res.status(404).json({
          success: false,
          message: 'KOL tidak ditemukan'
        });
      }

      // Verifikasi campaign exists
      const campaign = await Campaign.findById(campaign_id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign tidak ditemukan'
        });
      }

      // Cek apakah sudah di-bookmark
      const existingBookmark = await Bookmark.findOne({
        kol_id,
        campaign_id
      });

      if (existingBookmark) {
        return res.status(400).json({
          success: false,
          message: 'Campaign sudah di-bookmark'
        });
      }

      // Buat bookmark baru
      const bookmark = await Bookmark.create({
        kol_id,
        campaign_id
      });

      const populatedBookmark = await Bookmark.findById(bookmark._id)
        .populate({
          path: 'campaign_id',
          populate: {
            path: 'id_brand',
            select: 'nama industri'
          }
        })
        .populate('kol_id', 'email followers engagement niche tarif rating');

      return res.status(201).json({
        success: true,
        message: 'Bookmark berhasil ditambahkan',
        data: populatedBookmark
      });
    } catch (error) {
      console.error('Create bookmark error:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server'
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed'
  });
}

export default authMiddleware(handler);