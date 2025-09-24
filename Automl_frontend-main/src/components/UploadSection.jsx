// src/components/UploadSection.jsx
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function UploadSection({ setStep, setBackendData, filename, setFilename, columns, setColumns }) {
  const [file, setFile] = useState(null);
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type === "text/csv" || 
          droppedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        setFile(droppedFile);
      } else {
        toast.error("Please upload a CSV or Excel file only");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://automl-backend-izju.onrender.com/upload-dataset/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(res.data.message);
      setColumns(res.data.columns || []);
      setFilename(res.data.file_path || "");
      setBackendData(res.data);
    } catch (error) {
      console.error("Upload failed:", error.response || error.message);
      toast.error("Upload failed. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = async () => {
    if (!target) {
      toast.error("Please select a target column!");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("file_path", filename);
    formData.append("user_target", target);

    try {
      const res = await axios.post(
        "https://automl-backend-izju.onrender.com/run-automl/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("AutoML process completed!");
      setBackendData(res.data);
      setStep(1);
    } catch (error) {
      console.error("AutoML failed:", error.response?.data || error.message);
      toast.error(
        `AutoML failed: ${error.response?.data?.error || "Check backend logs"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="upload" className="relative py-20 px-4">
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151'
          },
        }}
      />

      <div className="max-w-3xl mx-auto bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-3xl text-white">📊</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Upload Your Dataset</h2>
          <p className="text-gray-300 text-lg">
            Supported formats: CSV or Excel. Maximum size: 10MB.
          </p>
        </div>

        <div className="space-y-8">

          <div 
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
              isDragging 
                ? 'border-cyan-400 bg-cyan-900/20' 
                : 'border-gray-600 hover:border-purple-400 bg-gray-900/30'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">📁</span>
            </div>
            
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all inline-block mb-4 shadow-lg"
            >
              Choose File
            </label>
            
            <p className="text-gray-400 mb-2">or drag and drop your file here</p>
            
            {file && (
              <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-purple-400 mr-3">📄</span>
                    <span className="text-white font-medium">{file.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
            )}
          </div>

          {file && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-5 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center shadow-lg"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <span>Upload Dataset</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </>
              )}
            </button>
          )}


          {columns.length > 0 && (
            <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">🎯</span>
                </span>
                Select Target Column
              </h3>
              
              <div className="relative">
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                >
                  <option value="">-- Choose Target Column --</option>
                  {columns.map((col, idx) => (
                    <option key={idx} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <button
                onClick={handleProceed}
                disabled={loading || !target}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-5 rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all disabled:opacity-50 mt-6 flex items-center justify-center shadow-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Running AutoML...
                  </>
                ) : (
                  <>
                    <span>Run AutoML Analysis</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}