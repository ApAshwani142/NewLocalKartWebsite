const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'localkart_super_secret_jwt_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

/**
 * Generate custom application JWT token
 * @param {Object} payload - Data to embed in token (id, role)
 * @returns {string} Signed JWT Token
 */
function generateToken(payload) {
  let tokenPayload;
  if (payload && typeof payload === 'object' && !payload._bsontype && payload.constructor?.name !== 'ObjectId' && payload.constructor?.name !== 'ObjectID') {
    const userId = payload.userId || (payload.id ? payload.id.toString() : payload._id ? payload._id.toString() : '');
    tokenPayload = {
      userId,
      id: userId,
      email: payload.email || '',
      role: payload.role || '',
      name: payload.name || '',
      ...payload
    };
  } else {
    const id = payload ? payload.toString() : '';
    tokenPayload = { userId: id, id };
  }
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
