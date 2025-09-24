import axios from "axios";
import toast from "react-hot-toast";

export default function TrainingStep({ backendData, setStep }) {
  const { model_comparison, best_model } = backendData;
  
  const handleDownload = async () => {
    try {
      const res = await axios.get(
        `https://automl-backend-izju.onrender.com/download-model/${best_model.name}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "trained_model.pkl");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Model downloaded!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download model.");
    }
  };

  return (
    <section id="results" className="max-w-5xl mx-auto bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-700">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🧠</span>
        </div>
        <h2 className="text-4xl font-bold text-white mb-3">Model Training Results</h2>
        <p className="text-gray-400 text-lg">Comparison of different machine learning models</p>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-7 rounded-2xl border border-gray-700 shadow-lg mb-10">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <span className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm">📊</span>
          </span>
          Model Performance Comparison
        </h3>

        <div className="overflow-x-auto rounded-xl border border-gray-700">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-700 to-cyan-700 text-white">
                <th className="p-4 text-left rounded-tl-xl">Model</th>
                <th className="p-4 text-center">Score</th>
                <th className="p-4 text-center rounded-tr-xl">Performance</th>
              </tr>
            </thead>
            <tbody>
              {model_comparison.map(([name, score], index) => (
                <tr
                  key={name}
                  className={`border-t border-gray-700 hover:bg-gray-800/50 transition-colors ${
                    name === best_model.name ? "bg-green-900/20" : ""
                  }`}
                >
                  <td className="p-4 font-medium text-white">
                    <div className="flex items-center">
                      {name === best_model.name && (
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                      )}
                      {name}
                    </div>
                  </td>
                  <td className="p-4 text-center font-semibold text-white">
                    {score.toFixed(3)}
                  </td>
                  <td className="p-4 text-center">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (score / Math.max(...model_comparison.map(m => m[1]))) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-7 rounded-2xl shadow-lg mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold mb-2 flex items-center">
              <span className="mr-2">🎉</span> Best Performing Model
            </h3>
            <p className="text-emerald-100">
              {best_model.name} achieved the highest score of {best_model.score.toFixed(3)}
            </p>
          </div>
          <div className="text-4xl animate-bounce">🏆</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleDownload}
          className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-8 py-4 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg border border-gray-600 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Model
        </button>
        <button
          onClick={() => setStep(5)}
          className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all shadow-lg flex items-center justify-center"
        >
          <span>Advanced Visualization</span>
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}