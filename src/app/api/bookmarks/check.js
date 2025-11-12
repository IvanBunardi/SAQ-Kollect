// pages/api/bookmarks/check.js
import dbConnect from '../../../lib/mongodb';
import Bookmark from '../../../models/Bookmark';
import { authMiddleware } from '../../../middleware/auth';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    await dbConnect();

    const { kol_id, campaign_id } = req.body;

    // Validasi input
    if (!kol_id || !campaign_id) {
      return res.status(400).json({
        success: false,
        message: 'KOL ID dan Campaign ID harus diisi'
      });
    }

    // Cek apakah sudah di-bookmark
    const bookmark = await Bookmark.findOne({
      kol_id,
      campaign_id
    });

    return res.status(200).json({
      success: true,
      data: {
        isBookmarked: !!bookmark,
        bookmarkId: bookmark?._id || null
      }
    });
  } catch (error) {
    console.error('Check bookmark error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
}

export default authMiddleware(handler);