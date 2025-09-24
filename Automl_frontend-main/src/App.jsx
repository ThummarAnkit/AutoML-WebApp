// src/App.jsx
import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UploadSection from "./components/UploadSection";
import CleaningStep from "./components/CleaningStep";
import EdaStep from "./components/EdaStep";
import FeatureEngineeringStep from "./components/FeatureEngineeringStep";
import TrainingStep from "./components/TrainingStep";
import VisualizationStep from "./components/VisualizationStep";
import SignIn from "./components/SignIn";
import About from "./components/About";

function App() {
  const [step, setStep] = useState(0); // 0: Upload, 1: Cleaning, 2: EDA, 3: Feature Eng, 4: Training, 5: Visualization
  const [filename, setFilename] = useState("");
  const [columns, setColumns] = useState([]);
  const [backendData, setBackendData] = useState({});
  const [visualizationData, setVisualizationData] = useState(null);
  const [currentView, setCurrentView] = useState("main"); // "main", "signin", "about", "results"

  const renderMainContent = () => (
    <>
      {step === 0 && (
        <>
          <Hero />
          <UploadSection 
            setStep={setStep} 
            setBackendData={setBackendData}
            filename={filename} 
            setFilename={setFilename}
            columns={columns}  
            setColumns={setColumns} 
          />
        </>
      )}

      {step === 1 && backendData.report && (
        <div className="py-12 px-4">
          <CleaningStep
            backendData={backendData.report} 
            setStep={setStep}
          />
        </div>
      )}

      {step === 2 && backendData.report && (
        <div className="py-12 px-4">
          <EdaStep
            backendData={backendData.report} 
            setStep={setStep}
          />
        </div>
      )}

      {step === 3 && backendData.report && (
        <div className="py-12 px-4">
          <FeatureEngineeringStep
            backendData={backendData.report} 
            setStep={setStep}
          />
        </div>
      )}

      {step === 4 && backendData.report && (
        <div className="py-12 px-4">
          <TrainingStep 
            backendData={backendData.report}
            setStep={setStep} 
          />
        </div>
      )}
      
      {step === 5 && (
        <div className="py-12 px-4">
          <VisualizationStep
            backendData={backendData}
            filename={filename} 
            visualizationData={visualizationData}
            setVisualizationData={setVisualizationData}
            setStep={setStep}
            columns={columns}  
            setColumns={setColumns}
          />
        </div>
      )}
    </>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case "signin":
        return <SignIn setCurrentView={setCurrentView} />;
      case "about":
        return <About setCurrentView={setCurrentView} />;
      default:
        return renderMainContent();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar setCurrentView={setCurrentView} currentView={currentView} />
      
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        {renderCurrentView()}
      </div>
    </div>
  );
}

export default App;