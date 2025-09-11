import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Helper components
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

const Modal = ({ title, content, onClose, size = "md" }) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl"
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className={`bg-gray-900 p-6 rounded-lg shadow-2xl text-white w-full ${sizeClasses[size]}`}>
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
};

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("movies");
  const [message, setMessage] = useState(null);
  const [messageStatus, setMessageStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [editingMovie, setEditingMovie] = useState(null);
  const [editingGenre, setEditingGenre] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!storedUser || !token || storedUser.role !== "admin") {
          navigate("/signin");
          return;
        }

        setAdmin(storedUser);

        await Promise.all([
          fetchUsers(token),
          fetchMovies(token),
          fetchGenres(token)
        ]);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
        showMessage("Failed to initialize dashboard", "error");
      }
    };
    fetchData();
  }, [navigate]);

  const showMessage = (msg, status) => {
    setMessage(msg);
    setMessageStatus(status);
    setTimeout(() => {
      setMessage(null);
      setMessageStatus("");
    }, 3000);
  };

  const fetchUsers = async (token) => {
    try {
      const response = await axios.get("http://localhost:8060/admin/allUsers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.status) {
        setUsers(response.data.data);
      } else {
        showMessage(response.data.message || "Error fetching users", "error");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      showMessage("Failed to fetch users", "error");
    }
  };

  const fetchMovies = async (token) => {
    try {
      const response = await axios.get("http://localhost:8060/admin/viewMovies", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.status) {
        setMovies(response.data.data);
      } else {
        showMessage(response.data.message || "Error fetching movies", "error");
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
      showMessage("Failed to fetch movies", "error");
    }
  };

  const fetchGenres = async (token) => {
    try {
      const response = await axios.get("http://localhost:8060/admin/genreGet", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.status) {
        setGenres(response.data.data);
      } else {
        showMessage(response.data.message || "Error fetching genres", "error");
      }
    } catch (err) {
      console.error("Error fetching genres:", err);
      showMessage("Failed to fetch genres", "error");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  // === Movie actions ===

  const openAddMovieModal = () => {
    setEditingMovie(null);
    setModalTitle("Add New Movie");
    setModalContent(
      <MovieForm
        onSubmit={handleAddMovie}
        genres={genres}
        onCancel={() => setIsModalOpen(false)}
      />
    );
    setIsModalOpen(true);
  };

  const openEditMovieModal = (movie) => {
    setEditingMovie(movie);
    setModalTitle("Edit Movie");
    setModalContent(
      <MovieForm
        onSubmit={handleEditMovie}
        genres={genres}
        movie={movie}
        onCancel={() => setIsModalOpen(false)}
      />
    );
    setIsModalOpen(true);
  };

  const handleAddMovie = async (movieData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8060/admin/addMovie",
        movieData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        setMovies(prev => [...prev, response.data.data]);
        showMessage("Movie added successfully", "success");
        setIsModalOpen(false);
      } else {
        showMessage(response.data.message || "Failed to add movie", "error");
      }
    } catch (err) {
      console.error("Add movie error:", err);
      showMessage(err.response?.data?.message || "Failed to add movie", "error");
    }
  };

  const handleEditMovie = async (movieData) => {
    if (!editingMovie) {
      showMessage("No movie selected for editing", "error");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const titleParam = encodeURIComponent(editingMovie.title);
      const response = await axios.put(
        `http://localhost:8060/admin/editMovie/${titleParam}`,
        movieData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        setMovies(prev =>
          prev.map(m => (m.title === editingMovie.title ? response.data.data : m))
        );
        showMessage("Movie updated successfully", "success");
        setIsModalOpen(false);
        setEditingMovie(null);
      } else {
        showMessage(response.data.message || "Failed to update movie", "error");
      }
    } catch (err) {
      console.error("Edit movie error:", err);
      showMessage(err.response?.data?.message || "Failed to update movie", "error");
    }
  };

  const handleDeleteMovie = async (movieTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${movieTitle}"?`)) return;
    try {
      const token = localStorage.getItem("token");
      const titleParam = encodeURIComponent(movieTitle);
      const response = await axios.delete(
        `http://localhost:8060/admin/deleteMovie/${titleParam}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        setMovies(prev => prev.filter(m => m.title !== movieTitle));
        showMessage("Movie deleted successfully", "success");
      } else {
        showMessage(response.data.message || "Failed to delete movie", "error");
      }
    } catch (err) {
      console.error("Delete movie error:", err);
      showMessage(err.response?.data?.message || "Failed to delete movie", "error");
    }
  };

  // === Genre actions ===

  const openAddGenreModal = () => {
    setEditingGenre(null);
    setModalTitle("Add New Genre");
    setModalContent(
      <GenreForm
        onSubmit={handleAddGenre}
        onCancel={() => setIsModalOpen(false)}
      />
    );
    setIsModalOpen(true);
  };

  const openEditGenreModal = (genre) => {
    setEditingGenre(genre);
    setModalTitle("Edit Genre");
    setModalContent(
      <GenreForm
        onSubmit={handleEditGenre}
        genre={genre}
        onCancel={() => setIsModalOpen(false)}
      />
    );
    setIsModalOpen(true);
  };

  const handleAddGenre = async (genreData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8060/admin/genre",
        genreData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        setGenres(prev => [...prev, response.data.data]);
        showMessage("Genre added successfully", "success");
        setIsModalOpen(false);
      } else {
        showMessage(response.data.message || "Failed to add genre", "error");
      }
    } catch (err) {
      console.error("Add genre error:", err);
      showMessage(err.response?.data?.message || "Failed to add genre", "error");
    }
  };

  const handleEditGenre = async (genreData) => {
    if (!editingGenre) {
      showMessage("No genre selected for editing", "error");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const nameParam = encodeURIComponent(editingGenre.name);
      const response = await axios.put(
        `http://localhost:8060/admin/genreEdit/${nameParam}`,
        genreData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        setGenres(prev =>
          prev.map(g => (g.name === editingGenre.name ? response.data.data : g))
        );
        showMessage("Genre updated successfully", "success");
        setIsModalOpen(false);
        setEditingGenre(null);
      } else {
        showMessage(response.data.message || "Failed to update genre", "error");
      }
    } catch (err) {
      console.error("Edit genre error:", err);
      showMessage(err.response?.data?.message || "Failed to edit genre", "error");
    }
  };

  const handleDeleteGenre = async (genreName) => {
    if (!window.confirm(`Are you sure you want to delete "${genreName}"?`)) return;
    try {
      const token = localStorage.getItem("token");
      const nameParam = encodeURIComponent(genreName);
      const response = await axios.delete(
        `http://localhost:8060/admin/genreDel/${nameParam}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        setGenres(prev => prev.filter(g => g.name !== genreName));
        showMessage("Genre deleted successfully", "success");
      } else {
        showMessage(response.data.message || "Failed to delete genre", "error");
      }
    } catch (err) {
      console.error("Delete genre error:", err);
      showMessage(err.response?.data?.message || "Failed to delete genre", "error");
    }
  };

  // === User actions ===

  const handleResetPassword = async (userId, userName) => {
    const newPassword = prompt(`Enter new password for ${userName}:`);
    if (!newPassword) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8060/admin/resetUserPass/${userId}`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        showMessage(`Password reset for ${userName}`, "success");
      } else {
        showMessage(response.data.message || "Failed to reset password", "error");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      showMessage(err.response?.data?.message || "Failed to reset password", "error");
    }
  };

  // If you have a DELETE user endpoint in backend, include this. If not, disable or remove.
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:8060/admin/userDel/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        showMessage("User deleted successfully", "success");
      } else {
        showMessage(response.data.message || "Failed to delete user", "error");
      }
    } catch (err) {
      console.error("Delete user error:", err);
      showMessage(err.response?.data?.message || "Failed to delete user", "error");
    }
  };

    // Form components
  const MovieForm = ({ onSubmit, genres, movie, onCancel }) => {
    const [formData, setFormData] = useState({
      title: movie?.title || "",
      desc: movie?.desc || "",
      year: movie?.year || "",
      url: movie?.url || "",
      bannerUrl: movie?.bannerUrl || "",
      genreId: movie?.genreId || "",
      rating: movie?.rating || 0
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      await onSubmit(formData);
      setSubmitting(false);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-600 transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-600 transition"
            required
            rows="3"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-600 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <input
              type="number"
              name="rating"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-600 transition"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Video URL</label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-600 transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Banner URL</label>
          <input
            type="url"
            name="bannerUrl"
            value={formData.bannerUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-600 transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Genre</label>
          <select
            name="genreId"
            value={formData.genreId}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-600 transition"
            required
          >
            <option value="">Select Genre</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2 transition"
          >
            {submitting && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            <span>{movie ? "Update" : "Add"} Movie</span>
          </button>
        </div>
      </form>
    );
  };

  const GenreForm = ({ onSubmit, genre, onCancel }) => {
    const [name, setName] = useState(genre?.name || "");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      await onSubmit({ name });
      setSubmitting(false);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Genre Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-600 transition"
            required
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2 transition"
          >
            {submitting && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            <span>{genre ? "Update" : "Add"} Genre</span>
          </button>
        </div>
      </form>
    );
  };

  if (loading) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center bg-black">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-black/80 backdrop-blur-md p-6 flex justify-between items-center shadow-lg">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-red-600">Netflix Admin</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold text-white/80">
            {admin?.name}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 px-6">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          {["movies", "genres", "users"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === tab
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content for each tab */}
        {activeTab === "movies" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Movies</h2>
              <button
                onClick={openAddMovieModal}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                + Add Movie
              </button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:scale-[1.02] transition"
                >
                  <img
                    src={movie.bannerUrl}
                    alt={movie.title}
                    className="w-full h-56 object-cover object-center"
                  />
                  <div className="p-4 space-y-2">
                    <h3 className="text-lg font-bold">{movie.title}</h3>
                    <p className="text-sm text-gray-400">{movie.year}</p>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => openEditMovieModal(movie)}
                        className="px-3 py-1 bg-blue-600 text-sm rounded hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMovie(movie.title)}
                        className="px-3 py-1 bg-red-600 text-sm rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "genres" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Genres</h2>
              <button
                onClick={openAddGenreModal}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                + Add Genre
              </button>
            </div>
            <ul className="space-y-3">
              {genres.map((genre) => (
                <li
                  key={genre.id}
                  className="flex justify-between items-center bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition"
                >
                  <span>{genre.name}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => openEditGenreModal(genre)}
                      className="px-3 py-1 bg-blue-600 text-sm rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGenre(genre.name)}
                      className="px-3 py-1 bg-red-600 text-sm rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {activeTab === "users" && (
          <section>
            <h2 className="text-xl font-bold mb-4">Users</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-900 rounded-lg">
                <thead>
                  <tr className="bg-gray-800 text-left">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-800">
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2 capitalize">{user.role}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleResetPassword(user.id, user.name)}
                          className="px-3 py-1 bg-yellow-600 text-sm rounded hover:bg-yellow-700 transition"
                        >
                          Reset Password
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="px-3 py-1 bg-red-600 text-sm rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {message && <Message message={message} status={messageStatus} />}
      {isModalOpen && (
        <Modal title={modalTitle} content={modalContent} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
