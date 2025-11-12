// pages/api/campaigns/brand/[brandId].js
import dbConnect from '../../../../lib/mongodb';
import Campaign from '../../../../models/Campaign';
import { authMiddleware } from '../../../../middleware/auth';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    await dbConnect();

    const { brandId } = req.query;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { id_brand: brandId };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const campaigns = await Campaign.find(query)
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
    console.error('Get brand campaigns error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
}

export default authMiddleware(handler);