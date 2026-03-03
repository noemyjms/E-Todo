const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.JWT_SECRET; // verification du token

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization; // get le token depuis le header Authorization
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = { userId: decoded.userId }; // comparaison avec le payload du token
    next();
  } catch (err) {
    res.status(403).json({ msg: 'Token is not valid' });
  }
};
