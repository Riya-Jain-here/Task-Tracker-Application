const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('No token or bad format');
  }
  const token = authHeader.split(' ')[1];

  {/*if (!token) return res.status(401).send('No token');*/}
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};

module.exports = authMiddleware;