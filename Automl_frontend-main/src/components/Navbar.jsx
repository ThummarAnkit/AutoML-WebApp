// src/components/Navbar.jsx
import { useState } from "react";

export default function Navbar({ setCurrentView, currentView }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (view) => {
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  const isActive = (view) => currentView === view;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button 
            onClick={() => handleNavigation("main")}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AutoML Pro
            </h1>
          </button>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavigation("main")}
              className={`transition-colors font-medium flex items-center group ${
                currentView === "main" ? "text-purple-300" : "text-gray-400 hover:text-white"
              }`}
            >
              <span className={`w-2 h-2 rounded-full mr-2 group-hover:animate-pulse ${
                currentView === "main" ? "bg-gradient-to-r from-purple-400 to-cyan-400" : "bg-gray-500"
              }`}></span>
              Home
            </button>
            
            <a href="#upload" className="text-gray-400 hover:text-white transition-colors font-medium">
              <button 
              className={`transition-colors font-medium ${
                isActive("results") ? "text-purple-300" : "text-gray-400 hover:text-white"
              }`}
            >
              Upload
            </button>
            </a>
            <button 
              onClick={() => handleNavigation("about")}
              className={`transition-colors font-medium ${
                isActive("about") ? "text-purple-300" : "text-gray-400 hover:text-white"
              }`}
            >
              About
            </button>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => handleNavigation("signin")}
              className="hidden md:block bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:from-purple-700 hover:to-cyan-700 transition-all shadow-lg"
            >
              Sign In
            </button>
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-6 border-t border-gray-700">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => handleNavigation("main")}
                className={`px-3 py-2 rounded-lg transition-colors text-left ${
                  currentView === "main" ? "bg-gray-800 text-purple-300" : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => handleNavigation("results")}
                className={`px-3 py-2 rounded-lg transition-colors text-left ${
                  isActive("results") ? "bg-gray-800 text-purple-300" : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                Results
              </button>
              <button 
                onClick={() => handleNavigation("about")}
                className={`px-3 py-2 rounded-lg transition-colors text-left ${
                  isActive("about") ? "bg-gray-800 text-purple-300" : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                About
              </button>
              <button 
                onClick={() => handleNavigation("signin")}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl font-medium mt-2 text-center"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}