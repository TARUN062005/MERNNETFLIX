const { prisma } = require('../utils/dbConnector');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// helper to verify JWT and role
function verifyRole(req, res, allowedRoles) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401).send({ message: 'No token provided', status: false });
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    if (!allowedRoles.includes(decoded.role)) {
      res.status(403).send({ message: 'Forbidden: insufficient privileges', status: false });
      return null;
    }
    return decoded;
  } catch (err) {
    res.status(401).send({ message: 'Invalid or expired token', status: false });
    return null;
  }
}

// Create a new genre (Admin only)
exports.createGenre = async (req, res) => {
  const user = verifyRole(req, res, ['admin']);
  if (!user) return;

  const { name } = req.body;
  try {
    const genreData = await prisma.genre.create({ data: { name } });
    res.status(201).send({ 
      message: 'Genre created successfully', 
      status: true, 
      data: genreData 
    });
  } catch (err) {
    res.status(400).send({ message: err.message, status: false });
  }
};

// Get all genres (Admin + User)
exports.getGenres = async (req, res) => {
  const user = verifyRole(req, res, ['admin', 'user']);
  if (!user) return;

  try {
    const genres = await prisma.genre.findMany({
      include: { movies: true },
    });
    res.status(200).send({ 
      message: 'Genres fetched successfully', 
      status: true, 
      data: genres 
    });
  } catch (err) {
    res.status(500).send({ message: err.message, status: false });
  }
};

// Get a single genre by name (Admin + User)
exports.getGenreById = async (req, res) => {
  const user = verifyRole(req, res, ['admin', 'user']);
  if (!user) return;

  const { name } = req.params;
  try {
    const genre = await prisma.genre.findFirst({
      where: { name },
      include: { movies: true },
    });
    if (!genre) {
      return res.status(404).send({ message: 'Genre not found', status: false });
    }
    res.status(200).send({ 
      message: 'Genre fetched successfully', 
      status: true, 
      data: genre 
    });
  } catch (err) {
    res.status(500).send({ message: err.message, status: false });
  }
};

// Update a genre (Admin only)
exports.updateGenre = async (req, res) => {
  const user = verifyRole(req, res, ['admin']);
  if (!user) return;

  const { name } = req.params;
  const { name: newName } = req.body;
  try {
    const genreToUpdate = await prisma.genre.findFirst({ where: { name } });
    if (!genreToUpdate) {
      return res.status(404).send({ message: 'Genre not found', status: false });
    }

    const updatedGenre = await prisma.genre.update({
      where: { id: genreToUpdate.id },
      data: { name: newName },
    });
    res.status(200).send({ 
      message: 'Genre updated successfully', 
      status: true, 
      data: updatedGenre 
    });
  } catch (err) {
    res.status(400).send({ message: err.message, status: false });
  }
};

// Delete a genre (Admin only)
exports.deleteGenre = async (req, res) => {
  const user = verifyRole(req, res, ['admin']);
  if (!user) return;

  const { name } = req.params;
  try {
    const genreToDelete = await prisma.genre.findFirst({ where: { name } });
    if (!genreToDelete) {
      return res.status(404).send({ message: 'Genre not found', status: false });
    }
    await prisma.genre.delete({ where: { id: genreToDelete.id } });
    res.status(200).send({ message: 'Genre deleted successfully', status: true });
  } catch (err) {
    res.status(400).send({ message: err.message, status: false });
  }
};
