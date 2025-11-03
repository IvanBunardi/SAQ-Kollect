// pages/api/campaigns/index.js
import dbConnect from '../../../lib/mongodb';
import Campaign from '../../../models/Campaign';
import Brand from '../../../models/Brand';
import { authMiddleware } from '../../../middleware/auth';

async function handler(req, res) {
  await dbConnect();

  // GET - Ambil semua campaign
  if (req.method === 'GET') {
    try {
      const { status, kategori, page = 1, limit = 10 } = req.query;
      
      const query = {};
      if (status) query.status = status;
      if (kategori) query.kategori = kategori;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const campaigns = await Campaign.find(query)
        .populate('id_brand', 'nama industri')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Campaign.countDocuments(query);

      return res.status(200).json({
        success: true,
        data: {
          campaigns,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit))
          }
        }
      });
    } catch (error) {
      console.error('Get campaigns error:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server'
      });
    }
  }

  // POST - Buat campaign baru
  if (req.method === 'POST') {
    try {
      const {
        id_brand,
        judul,
        deskripsi,
        tujuan,
        platform,
        kategori,
        status = 'draft',
        timeline
      } = req.body;

      // Validasi input
      if (!id_brand || !judul || !deskripsi) {
        return res.status(400).json({
          success: false,
          message: 'Brand ID, judul, dan deskripsi harus diisi'
        });
      }

      // Verifikasi brand exists
      const brand = await Brand.findById(id_brand);
      if (!brand) {
        return res.status(404).json({
          success: false,
          message: 'Brand tidak ditemukan'
        });
      }

      // Buat campaign baru
      const campaign = await Campaign.create({
        id_brand,
        judul,
        deskripsi,
        tujuan,
        platform,
        kategori,
        status,
        timeline
      });

      const populatedCampaign = await Campaign.findById(campaign._id)
        .populate('id_brand', 'nama industri');

      return res.status(201).json({
        success: true,
        message: 'Campaign berhasil dibuat',
        data: populatedCampaign
      });
    } catch (error) {
      console.error('Create campaign error:', error);
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