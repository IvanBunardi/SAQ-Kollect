import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Consistent JWT_SECRET usage
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Validate JWT_SECRET exists
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ WARNING: JWT_SECRET not set in environment variables. Using default (insecure).');
}

/**
 * Hash a plain text password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error('❌ Hash password error:', error);
    throw new Error('Failed to hash password');
  }
};

/**
 * Compare plain text password with hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} True if passwords match
 */
export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('❌ Compare password error:', error);
    return false;
  }
};

/**
 * Generate JWT token for user authentication
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {string} role - User role
 * @returns {string} JWT token
 */
export const generateToken = (userId, email, role) => {
  try {
    return jwt.sign(
      { userId, email, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  } catch (error) {
    console.error('❌ Generate token error:', error);
    throw new Error('Failed to generate token');
  }
};

/**
 * Verify JWT token and return decoded payload
 * @param {string} token - JWT token
 * @returns {object|null} Decoded token payload or null if invalid
 */
export const verifyToken = (token) => {
  try {
    // Use JWT_SECRET constant for consistency
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('❌ Token expired:', error.message);
    } else if (error.name === 'JsonWebTokenError') {
      console.error('❌ Invalid token:', error.message);
    } else {
      console.error('❌ Token verification error:', error);
    }
    return null;
  }
};

/**
 * Generate a random reset token for password reset
 * @param {string} email - User email for password reset
 * @returns {string} Reset token
 */
export const generateResetToken = (email) => {
  try {
    return jwt.sign(
      { 
        email, 
        purpose: 'password-reset',
        random: Math.random() // Add randomness for uniqueness
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  } catch (error) {
    console.error('❌ Generate reset token error:', error);
    throw new Error('Failed to generate reset token');
  }
};

/**
 * Verify reset token
 * @param {string} token - Reset token
 * @returns {object|null} Decoded token or null if invalid
 */
export const verifyResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify it's a password reset token
    if (decoded.purpose !== 'password-reset') {
      console.error('❌ Invalid token purpose');
      return null;
    }
    
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('❌ Reset token expired');
    } else {
      console.error('❌ Reset token verification error:', error);
    }
    return null;
  }
};