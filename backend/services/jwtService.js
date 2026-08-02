const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretlocalkartkey12345!';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

/**
 * Generate custom application JWT token
 * @param {Object} payload - Data to embed in token (id, role)
 * @returns {string} Signed JWT Token
 */
function generateToken(payload) {
  const tokenPayload = typeof payload === 'object' ? payload : { id: payload };
  return jwt.sign(tokenPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}

/**
 * Verify custom application JWT token
 * @param {string} token - Bearer JWT Token string
 * @returns {Object} Decoded payload
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  generateToken,
  verifyToken
};
