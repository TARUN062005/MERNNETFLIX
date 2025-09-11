import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white p-6 font-inter overflow-hidden">
      {/* Background Image */}
      <img
        src="src/assets/netflix-bg.png"
        alt="Netflix background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/70 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />

      {/* Content */}
      <div className="relative z-30 flex flex-col items-center justify-center max-w-4xl text-center p-4 sm:p-8 md:p-12 bg-black/50 rounded-lg shadow-2xl backdrop-blur-md border border-white/20">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
          alt="Netflix Logo"
          className="w-36 sm:w-40 mb-8 drop-shadow-lg"
        />

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
          About Netflix
        </h1>
        
        <hr className="w-16 h-1 my-6 bg-red-600 border-none rounded-full" />

        <p className="mt-4 max-w-2xl text-lg sm:text-xl font-light leading-relaxed">
          Netflix is the world's leading streaming entertainment service with over 200 million members in more than 190 countries enjoying TV series, documentaries, and feature films across a wide variety of genres and languages.
        </p>

        <p className="mt-4 max-w-2xl text-md sm:text-lg font-light leading-relaxed">
          Members can watch as much as they want, anytime, anywhere, on any internet-connected screen. Netflix is known for its award-winning originals and cinematic storytelling.
        </p>

        <Link
          to="/"
          className="mt-10 inline-block bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
