// server/middleware/authenticateMiddleware.js
const jwt = require('jsonwebtoken');

exports.verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token missing' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    req.user = decoded; // optional: store user info for later
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
exports.verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token missing' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    if (decoded.role !== 'user') {
      return res.status(403).json({ message: 'Access denied: Users only' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
