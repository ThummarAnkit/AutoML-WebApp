// src/components/VisualizationStep.jsx
import { useState, useEffect } from "react";
import Select from "react-select";
import toast from "react-hot-toast";

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: '#1f2937',
    borderColor: '#4b5563',
    color: 'white',
    borderRadius: '12px',
    padding: '4px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#9ca3af'
    }
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#1f2937',
    border: '1px solid #4b5563',
    borderRadius: '12px',
    overflow: 'hidden'
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#374151' : '#1f2937',
    color: 'white',
    '&:active': {
      backgroundColor: '#4b5563'
    }
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#4b5563',
    borderRadius: '8px'
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'white'
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#9ca3af',
    '&:hover': {
      backgroundColor: '#6b7280',
      color: 'white'
    }
  }),
  input: (provided) => ({
    ...provided,
    color: 'white'
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'white'
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#9ca3af'
  })
};

export default function VisualizationStep({
  backendData,
  filename,
  visualizationData,
  setVisualizationData,
  setStep,
  columns,
}) {
  const [loading, setLoading] = useState(false);
  const [columnsOptions, setColumnsOptions] = useState([]);
  const [chartsOptions] = useState([
    { value: "hist", label: "Histogram" },
    { value: "box", label: "Boxplot" },
    { value: "count", label: "Countplot" },
    { value: "pie", label: "Pie Chart" },
    { value: "heatmap", label: "Correlation Heatmap" },
  ]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedCharts, setSelectedCharts] = useState([]);
  const [downloading, setDownloading] = useState(false);


  useEffect(() => {
    if (columns && columns.length > 0) {
      setColumnsOptions(columns.map((col) => ({ value: col, label: col })));
    }
  }, [columns]);

  const handleGenerate = async () => {
    if (!filename) {
      toast.error("Dataset not available for visualization");
      return;
    }
    if (!selectedColumns.length || !selectedCharts.length) {
      toast.error("Please select columns and chart types");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file_path", filename);
      formData.append("columns", selectedColumns.map((c) => c.value).join(","));
      formData.append("charts", selectedCharts.map((c) => c.value).join(","));

      const res = await fetch("https://automl-backend-izju.onrender.com/visualize/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setVisualizationData(data);
      toast.success("Visualization generated!");
    } catch (err) {
      console.error("Visualization failed:", err);
      toast.error("Failed to generate visualization.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!backendData?.report_path) {
      toast.error("Report path not available");
      return;
    }

    setDownloading(true);
    try {
      const res = await fetch(
        `https://automl-backend-izju.onrender.com/download-report-pdf/?report_path=${encodeURIComponent(
          backendData.report_path
        )}`
      );

      if (!res.ok) {
        toast.error("Failed to download PDF report");
        setDownloading(false);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      const fileName =
        backendData.report_path
          ?.split("/")
          ?.pop()
          ?.replace(".json", ".pdf") || "report.pdf";
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF Report downloaded!");
    } catch (err) {
      console.error("PDF download failed:", err);
      toast.error("Error downloading PDF");
    } finally {
      setDownloading(false);
    }
  };


  const renderNumericSummary = () => {
    if (!visualizationData?.univariate_summary) return null;
    return (
      <div className="mb-10">
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm">📊</span>
          </span>
          Numeric Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(visualizationData.univariate_summary).map(
            ([col, stats]) => (
              <div key={col} className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl border border-gray-700">
                <h4 className="font-semibold text-white mb-4 p-3 bg-gray-900/50 rounded-xl border border-gray-700">
                  {col}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(stats).map(([k, v]) => (
                    <div
                      key={k}
                      className="bg-gray-900/50 p-3 rounded-xl border border-gray-700"
                    >
                      <p className="text-xs text-gray-400">{k}</p>
                      <p className="font-semibold text-white">
                        {typeof v === "number" ? v.toFixed(2) : v}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  };


  const renderCategoricalSummary = () => {
    if (!visualizationData?.categorical_summary) return null;
    return (
      <div className="mb-10">
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm">📋</span>
          </span>
          Categorical Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(visualizationData.categorical_summary).map(
            ([col, counts]) => (
              <div key={col} className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl border border-gray-700">
                <h4 className="font-semibold text-white mb-4 p-3 bg-gray-900/50 rounded-xl border border-gray-700">
                  {col}
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {Object.entries(counts).map(([val, count]) => (
                    <div key={val} className="flex justify-between text-sm py-2 border-b border-gray-700 last:border-b-0">
                      <span className="text-gray-300">{val}</span>
                      <span className="font-semibold text-white">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  };


  const renderPlots = () => {
    if (!visualizationData?.plots) return null;
    return (
      <div className="mb-10">
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <span className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm">📈</span>
          </span>
          Visualizations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(visualizationData.plots).map(([plotKey, base64]) => {
            if (!base64 || base64.trim() === "") {
              console.warn(`Skipping empty plot: ${plotKey}`);
              return null;
            }
            const cleanBase64 = base64.replace(/\s/g, "");
            return (
              <div key={plotKey} className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl border border-gray-700">
                <h4 className="font-semibold text-white mb-4 p-3 bg-gray-900/50 rounded-xl border border-gray-700">
                  {plotKey}
                </h4>
                <img
                  src={`data:image/png;base64,${cleanBase64}`}
                  alt={plotKey}
                  className="w-full rounded-xl border border-gray-700 shadow-sm"
                  onError={(e) => {
                    console.error(`Failed to load ${plotKey}`);
                    e.target.style.display = "none";
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className="max-w-7xl mx-auto bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-700">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <h2 className="text-4xl font-bold text-white mb-3">Advanced Visualization</h2>
        <p className="text-gray-400 text-lg">Generate advanced charts and insights from your dataset</p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-gray-300 mb-3 text-lg font-medium">Select Columns</label>
          <Select
            options={columnsOptions}
            value={selectedColumns}
            onChange={setSelectedColumns}
            isMulti
            placeholder="Select columns..."
            styles={customSelectStyles}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-3 text-lg font-medium">Select Charts</label>
          <Select
            options={chartsOptions}
            value={selectedCharts}
            onChange={setSelectedCharts}
            isMulti
            placeholder="Select chart types..."
            styles={customSelectStyles}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all mb-10 flex items-center justify-center shadow-lg"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Visualizations...
          </>
        ) : (
          "Generate Visualization"
        )}
      </button>


      {visualizationData && (
        <>
          {renderNumericSummary()}
          {renderCategoricalSummary()}
          {renderPlots()}


          <div className="mt-12 pt-8 border-t border-gray-700 flex flex-wrap gap-4 justify-between items-center">
            <button
              onClick={() => setStep(4)}
              className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-8 py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg border border-gray-600 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Results
            </button>
            
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:from-purple-700 hover:to-cyan-700 transition disabled:opacity-50 flex items-center"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF Report
                </>
              )}
            </button>
            
            <button
              onClick={() => setStep(0)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Start Over
            </button>
          </div>
        </>
      )}
    </section>
  );
}