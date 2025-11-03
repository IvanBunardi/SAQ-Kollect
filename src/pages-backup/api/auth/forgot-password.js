// pages/api/auth/forgot-password.js
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { generateResetToken } from '../../../lib/auth';
import { sendResetPasswordEmail } from '../../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { email } = req.body;

    // Validasi input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email harus diisi'
      });
    }

    // Cari user
    const user = await User.findOne({ email });
    if (!user) {
      // Jangan beritahu user bahwa email tidak ditemukan (security best practice)
      return res.status(200).json({
        success: true,
        message: 'Jika email terdaftar, link reset password telah dikirim'
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 jam

    // Simpan reset token ke database
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Kirim email
    await sendResetPasswordEmail(email, resetToken);

    return res.status(200).json({
      success: true,
      message: 'Jika email terdaftar, link reset password telah dikirim'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
}