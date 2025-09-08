const { prisma } = require('../utils/dbConnector');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Helper to verify JWT and allowed roles
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

// -------------------------
// Create a new movie (Admin only)
// -------------------------
exports.createMovie = async (req, res) => {
  const user = verifyRole(req, res, ['admin']);
  if (!user) return;

  const { title, desc, year, url, bannerUrl, genreId, rating } = req.body;
  try {
    const movieData = await prisma.movies.create({
      data: {
        title,
        desc,
        year: parseInt(year),
        url,
        bannerUrl,
        genreId,
        rating: rating ? parseInt(rating) : 0
      },
      include: { genre: true }
    });
    res.status(201).send({
      message: 'Movie created successfully',
      status: true,
      data: movieData
    });
  } catch (err) {
    res.status(400).send({ message: err.message, status: false });
  }
};

// -------------------------
// Get all movies (Admin + User)
// -------------------------
exports.getAllMovies = async (req, res) => {
  const user = verifyRole(req, res, ['admin', 'user']);
  if (!user) return;

  try {
    const movies = await prisma.movies.findMany({
      include: { genre: true }
    });
    res.status(200).send({
      message: 'Movies fetched successfully',
      status: true,
      data: movies
    });
  } catch (err) {
    res.status(500).send({ message: err.message, status: false });
  }
};

// -------------------------
// Get a single movie by title (Admin + User)
// -------------------------
exports.getMovieById = async (req, res) => {
  const user = verifyRole(req, res, ['admin', 'user']);
  if (!user) return;

  const { title } = req.params;
  try {
    const movie = await prisma.movies.findFirst({
      where: { title },
      include: { genre: true }
    });
    if (!movie) {
      return res.status(404).send({ message: 'Movie not found', status: false });
    }
    res.status(200).send({
      message: 'Movie fetched successfully',
      status: true,
      data: movie
    });
  } catch (err) {
    res.status(500).send({ message: err.message, status: false });
  }
};

// -------------------------
// Update a movie (Admin only)
// -------------------------
exports.updateMovie = async (req, res) => {
  const user = verifyRole(req, res, ['admin']);
  if (!user) return;

  const { title } = req.params;
  const { desc, year, url, bannerUrl, genreId, rating } = req.body;
  try {
    const movieToUpdate = await prisma.movies.findFirst({ where: { title } });
    if (!movieToUpdate) {
      return res.status(404).send({ message: 'Movie not found', status: false });
    }

    const updatedMovie = await prisma.movies.update({
      where: { id: movieToUpdate.id },
      data: {
        title,
        desc,
        year: parseInt(year),
        url,
        bannerUrl,
        genreId,
        rating: rating ? parseInt(rating) : undefined
      },
      include: { genre: true }
    });
    res.status(200).send({
      message: 'Movie updated successfully',
      status: true,
      data: updatedMovie
    });
  } catch (err) {
    res.status(400).send({ message: err.message, status: false });
  }
};

// -------------------------
// Delete a movie (Admin only)
// -------------------------
exports.deleteMovie = async (req, res) => {
  const user = verifyRole(req, res, ['admin']);
  if (!user) return;

  const { title } = req.params;
  try {
    const movieToDelete = await prisma.movies.findFirst({ where: { title } });
    if (!movieToDelete) {
      return res.status(404).send({ message: 'Movie not found', status: false });
    }
    await prisma.movies.delete({ where: { id: movieToDelete.id } });
    res.status(200).send({
      message: 'Movie deleted successfully',
      status: true
    });
  } catch (err) {
    res.status(400).send({ message: err.message, status: false });
  }
};

// -------------------------
// Rate a movie (Admin + User)
// -------------------------
exports.rateMovie = async (req, res) => {
  const user = verifyRole(req, res, ['admin', 'user']);
  if (!user) return;

  const { title } = req.params;
  const { rating } = req.body;
  try {
    const movie = await prisma.movies.findFirst({ where: { title } });
    if (!movie) return res.status(404).send({ message: 'Movie not found', status: false });

    const updatedMovie = await prisma.movies.update({
      where: { id: movie.id },
      data: { rating: parseInt(rating) }
    });

    res.status(200).send({ message: 'Rating updated successfully', status: true, data: updatedMovie });
  } catch (err) {
    res.status(400).send({ message: err.message, status: false });
  }
};
