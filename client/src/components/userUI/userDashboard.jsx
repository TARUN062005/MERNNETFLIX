import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// Helper components for consistency and a better user experience
const Spinner = () => (
  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
);

const Message = ({ message, status }) => (
  <div
    className={`fixed top-28 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg text-center font-semibold transition-all duration-300 ${
      status === 'success'
        ? 'bg-green-500 text-black'
        : 'bg-red-500 text-white'
    }`}
  >
    {message}
  </div>
);

const CustomModal = ({ title, content, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
    <div className="bg-gray-900 p-8 rounded-lg shadow-2xl text-white max-w-sm w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {content}
    </div>
  </div>
);

// Extract YouTube ID from various URL formats
const getYouTubeId = (url) => {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

// Updated VideoModal component with proper YouTube embedding
const VideoModal = ({ movie, onClose }) => {
  const youtubeId = getYouTubeId(movie.url);
  const embedUrl = youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl text-white max-w-4xl w-full">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-xl font-bold">{movie.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="relative" style={{ paddingBottom: '56.25%' }}> {/* 16:9 Aspect Ratio */}
          {embedUrl ? (
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-b-lg"
              src={embedUrl}
              title={movie.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gray-800 rounded-b-lg p-4">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold mb-2">Video Cannot Be Played</h3>
              <p className="text-gray-400 text-center mb-4">
                This video cannot be embedded. Please watch it on the original platform.
              </p>
              <a 
                href={movie.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-colors"
              >
                Watch on Original Site
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Star Rating Component
const StarRating = ({ rating, onRate, interactive = true, showValue = true, submitting = false }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={(e) => {
            if (interactive && !submitting) {
              e.stopPropagation();
              onRate(star);
            }
          }}
          disabled={!interactive || submitting}
          className={`text-lg transition-colors ${interactive ? 'cursor-pointer' : 'cursor-default'} ${
            star <= rating ? 'text-yellow-400' : 'text-gray-500'
          } ${interactive ? 'hover:text-yellow-300' : ''}`}
        >
          ★
        </button>
      ))}
      {submitting ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
      ) : showValue ? (
        <span className="text-sm font-bold text-yellow-400">
          {rating ? rating.toFixed(1) : "N/A"}
        </span>
      ) : null}
    </div>
  );
};

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageStatus, setMessageStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [submittingRating, setSubmittingRating] = useState(false);
  const navigate = useNavigate();

  // Fetch movies and genres on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
          navigate("/signin");
          return;
        }

        setUser(storedUser);
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch both movies and genres using the correct API routes
        const [moviesRes, genresRes] = await Promise.all([
          axios.get("http://localhost:8060/user/movies", { headers }),
          axios.get("http://localhost:8060/user/genres", { headers }),
        ]);

        const fetchedMovies = moviesRes.data.data;
        const fetchedGenres = genresRes.data.data;

        setMovies(fetchedMovies);
        setGenres(fetchedGenres);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data. Please check your server connection.");
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // Handle message display
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        setMessageStatus("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleRateMovie = async (movieTitle, rating) => {
    const token = localStorage.getItem("token");
    if (!user || !token) {
      navigate("/signin");
      return;
    }
    setSubmittingRating(true);

    try {
      const response = await axios.put(
        `http://localhost:8060/user/rateMovie/${movieTitle}`,
        { rating },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status) {
        setMovies(prevMovies =>
          prevMovies.map(movie =>
            movie.title === movieTitle ? { ...movie, rating } : movie
          )
        );
        setMessage("Movie rated successfully!");
        setMessageStatus("success");
      } else {
        setMessage(response.data.message || "Failed to rate movie");
        setMessageStatus("error");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to rate movie. Please try again.");
      setMessageStatus("error");
      console.error("Failed to rate movie:", err);
    } finally {
      setSubmittingRating(false);
    }
  };
  
  const handleViewPaymentOptions = async () => {
    // Mocking a response as no `getPayment` API was provided
    setModalContent(
      <div>
        <p className="text-gray-300">Available Payment Gateways:</p>
        <ul className="list-disc list-inside mt-2 space-y-2">
          <li>Visa </li>
          <li>Mastercard </li>
          <li>Amex </li>
          <li>Paypal </li>
          <li>Google Pay </li>
        </ul>
        <p className="text-gray-300 mt-4">Supported Banks:</p>
        <ul className="list-disc list-inside mt-2 space-y-2">
          <li>Bank of America</li>
          <li>Chase</li>
          <li>Wells Fargo</li>
        </ul>
      </div>
    );
    setIsModalOpen(true);
  };

  const handleMovieClick = (movie) => {
    setCurrentMovie(movie);
    setIsVideoModalOpen(true);
  };

  if (loading) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center bg-black">
        <div className="text-white text-3xl font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center bg-black">
        <div className="text-red-500 text-xl font-bold">{error}</div>
      </div>
    );
  }

  // Determine which movies to display based on search term
  const filteredMovies = movies.filter(movie =>
    (movie.title && movie.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (movie.genre?.name && movie.genre.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group filtered movies by genre
  const groupedMovies = genres.reduce((acc, genre) => {
    const moviesForGenre = filteredMovies.filter(movie => movie.genre?.name === genre.name);
    if (moviesForGenre.length > 0 || searchTerm === '') {
        acc[genre.name] = moviesForGenre;
    }
    return acc;
  }, {});

  // Handle single movie search
  const movieSearch = movies.find(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const showGrouped = !searchTerm || (searchTerm && !movieSearch);
  const displayMovies = showGrouped ? groupedMovies : { "Search Results": [movieSearch] };

  return (
    <div className="min-h-screen bg-black text-white font-inter flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-black/80 backdrop-blur-md p-6 flex justify-between items-center shadow-lg">
        <Link to="/" className="flex items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
            alt="Netflix Logo"
            className="w-24 sm:w-32"
          />
        </Link>
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline text-lg font-semibold text-white/80">
            Welcome, {user?.name || "User"}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-all duration-300 transform hover:scale-105"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Global Message */}
      {message && <Message message={message} status={messageStatus} />}

      {/* Payment Options Modal */}
      {isModalOpen && (
        <CustomModal
          title="Payment Options"
          content={modalContent}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Video Playback Modal */}
      {isVideoModalOpen && currentMovie && (
        <VideoModal movie={currentMovie} onClose={() => setIsVideoModalOpen(false)} />
      )}

      <main className="pt-28 pb-12 px-6 flex-grow">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 space-y-4 sm:space-y-0">
          <h1 className="text-4xl sm:text-5xl font-extrabold drop-shadow-lg">
            Movies
          </h1>
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <button
              onClick={handleViewPaymentOptions}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300"
            >
              Payment Options
            </button>
            <input
              type="text"
              placeholder="Search movies or genres..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 px-4 py-3 rounded-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        {/* Movie Sections by Genre */}
        <div className="space-y-12">
          {Object.keys(displayMovies).length > 0 ? (
            Object.keys(displayMovies).map(genre => (
              <div key={genre}>
                <h2 className="text-3xl font-extrabold mb-6 drop-shadow-md">{genre}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {displayMovies[genre].map(movie => (
                    <div
                      key={movie.id}
                      className="bg-gray-900 rounded-lg overflow-hidden shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col relative"
                    >
                      {/* Movie average rating badge */}
                      {movie.rating && (
                        <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 font-bold py-1 px-2 rounded-full flex items-center z-10">
                          <span className="mr-1">★</span>
                          <span>{movie.rating.toFixed(1)}</span>
                        </div>
                      )}
                      <div 
                        className="h-48 overflow-hidden relative"
                        onClick={() => handleMovieClick(movie)}
                      >
                        <img
                          src={movie.bannerUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null; // prevents infinite loop
                            e.target.src = "https://placehold.co/400x300/1e293b/a1a1aa?text=No+Image";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-red-600 rounded-full p-3 transform hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex-grow">
                          <h2 className="text-xl font-semibold mb-1 truncate">{movie.title}</h2>
                          <p className="text-sm text-gray-400 mb-2">{movie.year}</p>
                          <p className="text-sm text-gray-300 line-clamp-3 mb-3">{movie.desc}</p>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">{movie.genre?.name || "Unknown"}</span>
                          <StarRating 
                            rating={movie.rating || 0} 
                            onRate={(rating) => handleRateMovie(movie.title, rating)}
                            submitting={submittingRating}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 text-xl py-12">
              No movies found.
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-6 text-center text-gray-500 text-sm font-bold">
        &copy; {new Date().getFullYear()} Netflix Clone. All rights reserved to None.
      </footer>
    </div>
  );
}