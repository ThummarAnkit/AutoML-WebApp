export default function CleaningStep({ backendData, setStep }) {
  const { cleaning_summary } = backendData;

  return (
    <section className="max-w-5xl mx-auto bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-700">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🧹</span>
        </div>
        <h2 className="text-4xl font-bold text-white mb-3">Data Cleaning Summary</h2>
        <p className="text-gray-400 text-lg">Your data has been processed and cleaned successfully</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 shadow-lg hover:shadow-purple-500/10 transition-all">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center mr-4 border border-blue-700/30">
              <span className="text-blue-400 text-xl">📊</span>
            </div>
            <h3 className="font-semibold text-gray-300">Final Shape</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {cleaning_summary.final_shape.join(" × ")}
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 shadow-lg hover:shadow-green-500/10 transition-all">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-900/30 rounded-xl flex items-center justify-center mr-4 border border-green-700/30">
              <span className="text-green-400 text-xl">🧹</span>
            </div>
            <h3 className="font-semibold text-gray-300">Duplicates Removed</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {cleaning_summary.duplicates_removed}
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 shadow-lg hover:shadow-red-500/10 transition-all">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-900/30 rounded-xl flex items-center justify-center mr-4 border border-red-700/30">
              <span className="text-red-400 text-xl">📈</span>
            </div>
            <h3 className="font-semibold text-gray-300">Outliers Removed</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {cleaning_summary.outliers_removed}
          </p>
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center group"
      >
        <span>Proceed to Exploratory Data Analysis</span>
        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}