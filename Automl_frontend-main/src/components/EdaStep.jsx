export default function EdaStep({ backendData, setStep }) {
  const { eda, plots } = backendData;

  return (
    <section className="max-w-7xl mx-auto bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-700">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📈</span>
        </div>
        <h2 className="text-4xl font-bold text-white mb-3">Exploratory Data Analysis</h2>
        <p className="text-gray-400 text-lg">Comprehensive analysis of your dataset features</p>
      </div>


      {eda.numeric_summary && (
        <div className="mb-10">
          <div className="flex items-center mb-6 p-4 bg-gray-900/50 rounded-2xl border border-gray-700">
            <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center mr-4 border border-blue-700/30">
              <span className="text-blue-400 text-xl">🔢</span>
            </div>
            <h3 className="text-2xl font-semibold text-white">Numeric Features</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(eda.numeric_summary).map(([col, stats]) => (
              <div key={col} className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl border border-gray-700 hover:shadow-lg transition-all">
                <h4 className="font-semibold text-white mb-4 p-3 bg-gray-900/50 rounded-xl border border-gray-700">
                  {col}
                </h4>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400">Mean</p>
                    <p className="font-semibold text-white">{stats.mean.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400">Median</p>
                    <p className="font-semibold text-white">{stats.median.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400">Std</p>
                    <p className="font-semibold text-white">{stats.std.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400">Outliers</p>
                    <p className="font-semibold text-white">{stats.outliers}</p>
                  </div>
                </div>


                <div className="space-y-4">
                  {plots[`hist_${col}`] && (
                    <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700">
                      <img
                        src={`data:image/png;base64,${plots[`hist_${col}`]}`}
                        alt={`Histogram of ${col}`}
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}
                  {plots[`box_${col}`] && (
                    <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700">
                      <img
                        src={`data:image/png;base64,${plots[`box_${col}`]}`}
                        alt={`Boxplot of ${col}`}
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {eda.categorical_summary && (
        <div className="mb-10">
          <div className="flex items-center mb-6 p-4 bg-gray-900/50 rounded-2xl border border-gray-700">
            <div className="w-12 h-12 bg-green-900/30 rounded-xl flex items-center justify-center mr-4 border border-green-700/30">
              <span className="text-green-400 text-xl">📋</span>
            </div>
            <h3 className="text-2xl font-semibold text-white">Categorical Features</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(eda.categorical_summary).map(([col, counts]) => (
              <div key={col} className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl border border-gray-700 hover:shadow-lg transition-all">
                <h4 className="font-semibold text-white mb-4 p-3 bg-gray-900/50 rounded-xl border border-gray-700">
                  {col}
                </h4>
                
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 mb-4">
                  <p className="text-xs text-gray-400 mb-3">Value Counts</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {Object.entries(counts).map(([val, count]) => (
                      <div key={val} className="flex justify-between text-sm py-1 border-b border-gray-700 last:border-b-0">
                        <span className="text-gray-300">{val}</span>
                        <span className="font-semibold text-white">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>


                <div className="space-y-4">
                  {plots[`count_${col}`] && (
                    <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700">
                      <img
                        src={`data:image/png;base64,${plots[`count_${col}`]}`}
                        alt={`Countplot of ${col}`}
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}
                  {plots[`pie_${col}`] && (
                    <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700">
                      <img
                        src={`data:image/png;base64,${plots[`pie_${col}`]}`}
                        alt={`Pie chart of ${col}`}
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {plots.correlation_heatmap && (
        <div className="mb-10">
          <div className="flex items-center mb-6 p-4 bg-gray-900/50 rounded-2xl border border-gray-700">
            <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center mr-4 border border-purple-700/30">
              <span className="text-purple-400 text-xl">🔗</span>
            </div>
            <h3 className="text-2xl font-semibold text-white">Correlation Heatmap</h3>
          </div>
          
          <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-700">
            <img
              src={`data:image/png;base64,${plots.correlation_heatmap}`}
              alt="Correlation Heatmap"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}

      <button
        onClick={() => setStep(3)}
        className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center group"
      >
        <span>Proceed to Feature Engineering</span>
        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}