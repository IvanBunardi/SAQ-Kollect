// pages/api/bookmarks/[id].js
import dbConnect from '../../../lib/mongodb';
import Bookmark from '../../../models/Bookmark';
import { authMiddleware } from '../../../middleware/auth';

async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  // GET - Ambil bookmark by ID
  if (req.method === 'GET') {
    try {
      const bookmark = await Bookmark.findById(id)
        .populate({
          path: 'campaign_id',
          populate: {
            path: 'id_brand',
            select: 'nama industri budget rating'
          }
        })
        .populate('kol_id', 'email followers engagement niche tarif rating');

      if (!bookmark) {
        return res.status(404).json({
          success: false,
          message: 'Bookmark tidak ditemukan'
        });
      }

      return res.status(200).json({
        success: true,
        data: bookmark
      });
    } catch (error) {
      console.error('Get bookmark error:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server'
      });
    }
  }

  // DELETE - Hapus bookmark
  if (req.method === 'DELETE') {
    try {
      const bookmark = await Bookmark.findByIdAndDelete(id);

      if (!bookmark) {
        return res.status(404).json({
          success: false,
          message: 'Bookmark tidak ditemukan'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Bookmark berhasil dihapus'
      });
    } catch (error) {
      console.error('Delete bookmark error:', error);
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