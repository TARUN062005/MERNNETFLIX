// server/controller/adminController.js
const { prisma } = require('../utils/dbConnector');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware to verify admin JWT
 */
function verifyAdmin(req, res) {
  const authHeader = req.headers['authorization'];
  console.log("Admin Auth:", authHeader);

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

/**
 * Get all users
 */
exports.getAllUsers = async (req, res) => {
  const admin = verifyAdmin(req, res);
  if (!admin) return;

  try {
    const data = await prisma.user.findMany();  
    res.status(200).send({ status: true, data });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
  }
};

/**
 * Delete user by ID
 */
exports.userDelete = async (req, res) => {
  const admin = verifyAdmin(req, res);
  if (!admin) return;

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ status: false, message: "User ID is required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    await prisma.user.delete({ where: { id } });

    res.status(200).json({ status: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Failed to delete user", error: error.message });
  }
};
