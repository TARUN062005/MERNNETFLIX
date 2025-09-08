// server/controller/adminController.js
const { prisma } = require('../utils/dbConnector');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyAdmin(req, res) {
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  
  if (!authHeader) {
    res.status(401).send({ message: 'No token provided', status: false });
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    if (decoded.role !== 'admin') {
      res.status(403).send({ message: 'Forbidden: Admins only', status: false });
      return null;
    }
    return decoded;
  } catch (err) {
    res.status(401).send({ message: 'Invalid or expired token', status: false });
    return null;
  }
}

exports.getAllUsers = async (req, res) => {

  try {
    const data = await prisma.user.findMany();  
    res.status(200).send({ status: true, data });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
