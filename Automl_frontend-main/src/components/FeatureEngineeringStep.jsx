export default function FeatureEngineeringStep({ backendData, setStep }) {
  const { feature_engineering } = backendData;

  return (
    <section className="max-w-5xl mx-auto bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-700">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚙️</span>
        </div>
        <h2 className="text-4xl font-bold text-white mb-3">Feature Engineering</h2>
        <p className="text-gray-400 text-lg">Features have been processed and prepared for modeling</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-7 rounded-2xl border border-gray-700 shadow-lg">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center mr-4 border border-blue-700/30">
              <span className="text-blue-400 text-xl">🔤</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Categorical Features</h3>
          </div>
          
          <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-700">
            {feature_engineering.categorical_features.length > 0 ? (
              <ul className="space-y-3">
                {feature_engineering.categorical_features.map((feature, index) => (
                  <li key={index} className="flex items-center py-2 border-b border-gray-700 last:border-b-0">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No categorical features found</p>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-7 rounded-2xl border border-gray-700 shadow-lg">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-900/30 rounded-xl flex items-center justify-center mr-4 border border-green-700/30">
              <span className="text-green-400 text-xl">123</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Numerical Features</h3>
          </div>
          
          <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-700">
            {feature_engineering.numerical_features.length > 0 ? (
              <ul className="space-y-3">
                {feature_engineering.numerical_features.map((feature, index) => (
                  <li key={index} className="flex items-center py-2 border-b border-gray-700 last:border-b-0">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No numerical features found</p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => setStep(4)}
        className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center group"
      >
        <span>Proceed to Model Training</span>
        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}