// pages/api/auth/register.js
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { hashPassword, generateToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { nama, email, password, role = 'user' } = req.body;

    // Validasi input
    if (!nama || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, dan password harus diisi'
      });
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid'
      });
    }

    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 6 karakter'
      });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Buat user baru
    const user = await User.create({
      nama,
      email,
      password: hashedPassword,
      role
    });

    // Generate token
    const token = generateToken(user._id, user.email, user.role);

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        user: {
          id: user._id,
          nama: user.nama,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
}