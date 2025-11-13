const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 * @param {string} userId - User's MongoDB _id
 * @returns {string} - Signed JWT token
 */
exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * Generate Email Verification Token
 * @param {string} userId - User's MongoDB _id
 * @returns {string} - Signed verification token (24 hours expiry)
 */
exports.generateVerificationToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

/**
 * Verify Token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 */
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
