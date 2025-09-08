// server/router/userRoute.js
const express = require("express");
const router = express.Router();

const authController = require('../controller/authController');
const movieController = require('../controller/movieController');
const genreController = require('../controller/genreController');
const { verifyUser } = require('../middleware/authenticateMiddleware');

const { userLogin, userRegister } = authController;
const { getAllMovies, getMovieById, rateMovie } = movieController;
const { getGenres, getGenreById } = genreController;

router.post('/register', userRegister);
router.post('/login', userLogin);

router.get('/movies', verifyUser, getAllMovies);
router.get('/movie/:title', verifyUser, getMovieById);
router.post('/rateMovie/:title', verifyUser, rateMovie);

router.post('/searchMovie', verifyUser, (req, res) => { 
    const { query } = req.body;
    res.status(200).send(`Search results for: ${query}`);
});

router.get('/genres', verifyUser, getGenres);
router.get('/genre/:name', verifyUser, getGenreById);
router.get('/movies/genre/:genreName', verifyUser, async (req, res) => { 
    const { genreName } = req.params;
    res.status(200).send(`Movies for genre: ${genreName}`);
});

module.exports = router;
