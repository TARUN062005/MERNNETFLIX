const express = require("express");
const router = express.Router();

const adminController = require('../controller/adminController');
const authController = require('../controller/authController');
const genreController = require('../controller/genreController');
const movieController = require('../controller/movieController');
const { verifyAdmin } = require('../middleware/authenticateMiddleware');

const { adminLogin, adminRegister, adminChangePass, adminResetUserPassword } = authController;
const { getAllUsers, userDelete } = adminController;
const { createGenre, getGenres, getGenreById, updateGenre, deleteGenre } = genreController;
const { createMovie, getAllMovies, getMovieById, updateMovie, deleteMovie, rateMovie } = movieController;

router.post('/register', adminRegister);
router.post('/login', adminLogin);
router.get('/allUsers', verifyAdmin, getAllUsers);
router.put('/changePass/:id', verifyAdmin, adminChangePass);
router.put('/resetUserPass/:userId', verifyAdmin, adminResetUserPassword);
router.post('/genre', verifyAdmin, createGenre);
router.get('/genreGet', verifyAdmin, getGenres);
router.get('/genre/:title', verifyAdmin, getGenreById);
router.put('/genreEdit/:title', verifyAdmin, updateGenre);
router.delete('/genreDel/:title', verifyAdmin, deleteGenre);

router.post('/addMovie', verifyAdmin, createMovie);
router.get('/viewMovies', verifyAdmin, getAllMovies);
router.get('/viewMovie/:title', verifyAdmin, getMovieById);
router.put('/editMovie/:title', verifyAdmin, updateMovie);
router.delete('/deleteMovie/:title', verifyAdmin, deleteMovie);
router.post('/rateMovie/:title', verifyAdmin, rateMovie);

// ✅ Added user delete route
router.delete('/userDel/:id', verifyAdmin, userDelete);

module.exports = router;
