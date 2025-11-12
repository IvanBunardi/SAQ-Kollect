// pages/api/campaigns/[id].js
import dbConnect from '../../../lib/mongodb';
import Campaign from '../../../models/Campaign';
import { authMiddleware } from '../../../middleware/auth';

async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  // GET - Ambil campaign by ID
  if (req.method === 'GET') {
    try {
      const campaign = await Campaign.findById(id)
        .populate('id_brand', 'nama email industri budget rating');

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign tidak ditemukan'
        });
      }

      return res.status(200).json({
        success: true,
        data: campaign
      });
    } catch (error) {
      console.error('Get campaign error:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server'
      });
    }
  }

  // PUT - Update campaign
  if (req.method === 'PUT') {
    try {
      const updateData = req.body;

      const campaign = await Campaign.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('id_brand', 'nama industri');

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign tidak ditemukan'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Campaign berhasil diupdate',
        data: campaign
      });
    } catch (error) {
      console.error('Update campaign error:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server'
      });
    }
  }

  // DELETE - Hapus campaign
  if (req.method === 'DELETE') {
    try {
      const campaign = await Campaign.findByIdAndDelete(id);

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign tidak ditemukan'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Campaign berhasil dihapus'
      });
    } catch (error) {
      console.error('Delete campaign error:', error);
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