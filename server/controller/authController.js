const { prisma } = require('../utils/dbConnector');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.adminRegister = async (req, res) => {
  // Corrected to expect 'name', 'email', 'password'
  const { name, email, password } = req.body;
  console.log(name,email,password);
  try {
    const hashPassword = await bcrypt.hash(password, 10);

   const UserData = await prisma.user.create({
      data: { name, email, role: 'admin', password: hashPassword }
    });

    res.status(201).send({ message: 'Admin created', status: true, data: UserData });
  } catch (err) {
    res.status(400).send({ message: err.message, status: false });
  }
};

exports.adminLogin = async (req, res) => {
  // Corrected to expect 'password'
  const { email, password } = req.body;
  try {
    const validUser = await prisma.user.findFirst({ where: { email, role: 'admin' } });
    if (!validUser) return res.status(400).send({ message: "User doesn't exist" });

    const validPass = await bcrypt.compare(password, validUser.password);
    if (!validPass) return res.status(400).send({ message: "Wrong Password" });

    const token = jwt.sign(
      { id: validUser.id, email: validUser.email, role: validUser.role },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: '1h' }
    );

    res.status(200).send({ message: "Login Successful", token });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

exports.userRegister = async (req, res) => {
  // Corrected to expect 'password'
  const { name, email, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const UserData = await prisma.user.create({
      data: { name, email, role: 'user', password: hashPassword }
    });

    res.status(201).send({ message: 'User created', status: true, data: UserData });
  } catch (err) {
    res.status(400).send({ message: err.message, status: false });
  }
};

exports.userLogin = async (req, res) => {
  // Corrected to expect 'password'
  const { email, password } = req.body;
  try {
    const validUser = await prisma.user.findFirst({ where: { email, role: 'user' } });
    if (!validUser) return res.status(400).send({ message: "User doesn't exist" });

    const validPass = await bcrypt.compare(password, validUser.password);
    if (!validPass) return res.status(400).send({ message: "Wrong Password" });

    const token = jwt.sign(
      { id: validUser.id, email: validUser.email, role: validUser.role },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: '2h' }
    );

    res.status(200).send({ message: "User Login Successful", token });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

// admin can change their own password
exports.adminChangePass = async (req, res) => {
  const adminId = req.params.id;
  // Corrected to expect 'newPassword'
  const { oldPassword, newPassword } = req.body;
  try {
    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin) return res.status(400).send({ message: "Admin not found" });

    const validPass = await bcrypt.compare(oldPassword, admin.password);
    if (!validPass) return res.status(400).send({ message: "Old password is incorrect" });

    const hashNew = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: adminId },
      data: { password: hashNew }
    });

    res.status(200).send({ status: true, message: "Password Updated Successfully" });
  } catch (err) {
    res.status(400).send({ status: false, message: err.message });
  }
};

// Admin can reset any user's password
exports.adminResetUserPassword = async (req, res) => {
  const { userId } = req.params; 
  // Corrected to expect 'newPassword'
  const { newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).send({ status: false, message: "User not found" });
    const hashNew = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashNew }
    });

    res.status(200).send({ status: true, message: `Password for ${user.role} updated successfully` });
  } catch (err) {
    res.status(400).send({ status: false, message: err.message });
  }
};
