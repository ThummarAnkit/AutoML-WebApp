export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/30 to-cyan-900/20">
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-gray-900 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </div>
      

      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 2}px`,
              height: `${Math.random() * 10 + 2}px`,
              background: `radial-gradient(circle, ${i % 3 === 0 ? 'rgba(168, 85, 247, 0.5)' : i % 3 === 1 ? 'rgba(6, 182, 212, 0.5)' : 'rgba(236, 72, 153, 0.5)'})`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${Math.random() * 10 + 15}s`,
            }}
          ></div>
        ))}
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="w-28 h-28 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/30">
            <span className="text-5xl">🤖</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Automate Your
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Machine Learning
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Upload your dataset, choose your target, and let our advanced AutoML platform 
            handle everything from data cleaning to model selection with cutting-edge AI.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <a
            href="#upload"
            className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center group"
          >
            <span>Get Started</span>
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a
            href="/about"
            className="border-2 border-gray-700 text-gray-300 font-semibold px-8 py-4 rounded-xl hover:border-purple-500 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
          >
            Learn More
          </a>
        </div>
      </div>
      

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}