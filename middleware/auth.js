// middleware/auth.js
export const authMiddleware = (handler) => async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    req.user = decoded;
    return handler(req, res);
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};