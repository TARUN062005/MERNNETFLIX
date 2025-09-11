// client/src/components/common/header.jsx
import { Link } from "react-router-dom";

export default function Header({ onSignInClick, About , Contact}) {
  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <img
        src="src/assets/netflix-bg.png"
        alt="netflix background"
        className="w-full h-full object-cover"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />

      {/* Content Layer */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between z-30">
        {/* Top Nav */}
        <div className="flex justify-between items-center p-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
            alt="Netflix Logo"
            className="w-58 h-auto cursor-pointer relative rigth-10 left-15"
          />
          <div className="flex items-center gap-4">
              <Link to="/About">
               <button
                className="bg-black-600 hover:bg-black-700 text-white font-bold rounded px-8 py-4 text-lg border-2 border-transparent hover:border-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                aria-label="Sign In"
              >
                About
              </button>
              </Link>
               <Link to="/Contact">
              <button
                className="bg-black-600 hover:bg-black-700 text-white font-bold rounded px-8 py-4 text-lg border-2 border-transparent hover:border-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                aria-label="Sign In"
              >
                Contact
              </button>           
              </Link> 
            <select
              className="bg-black/50 text-white font-bold rounded px-6 py-4 border-2 border-white text-lg"
              aria-label="Language selector"
            >
              <option className="bg-black text-white" value="en">English</option>
              <option className="bg-black text-white" value="te">Telugu</option>
              <option className="bg-black text-white" value="hi">Hindi</option>
            </select>
            <Link to="/signin">
              <button
                onClick={onSignInClick}
                className="bg-red-600 hover:bg-red-700 text-white font-bold rounded px-8 py-4 text-lg border-2 border-transparent hover:border-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                aria-label="Sign In"
              >
                Sign In
              </button>
            </Link>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center text-center px-4">
          <div className="text-white max-w-3xl w-full">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-wide drop-shadow-lg">
              Unlimited movies, TV shows and more
            </h1>
            <p className="text-xl mb-2">Starts at ₹149. Cancel at any time.</p>
            <p className="text-lg mb-6">
              Ready to watch? Enter your email to create or restart your membership.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <input
                type="email"
                placeholder="Email address"
                className="w-full sm:w-2/3 max-w-lg p-4 rounded text-white text-lg border-2 border-white bg-black/30 placeholder-white"
                aria-label="Email address"
              />
               <button className="bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white font-bold px-12 py-5 rounded text-xl border-2 border-transparent hover:border-white transition-all duration-300 hover:shadow-xl hover:scale-105 animate-pulse" aria-label="Get Started">
                 Get Started &#62;
                 </button> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}