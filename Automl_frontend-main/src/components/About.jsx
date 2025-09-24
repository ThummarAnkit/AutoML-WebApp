// src/components/About.jsx
import { Link } from "react-router-dom";

export default function About() {
  const features = [
    {
      icon: "📊",
      title: "Data Cleaning ",
      description: "Automatically handle missing values, remove duplicates, and detect outliers to ensure your data is pristine and ready for analysis."
    },
    {
      icon: "🔍",
      title: "Exploratory Data Analysis",
      description: "Gain deep insights with comprehensive statistical summaries, correlation analysis, and interactive visualizations of your dataset."
    },
    {
      icon: "⚙️",
      title: "Data Preprocessing",
      description: "Automatically identify and process categorical and numerical features, creating optimal input for machine learning models."
    },
    {
      icon: "🧠",
      title: "Model Training & Comparison",
      description: "Train multiple machine learning models with optimized hyperparameters and compare their performance to find the best solution."
    },
    {
      icon: "📈",
      title: "Advanced Visualization",
      description: "Generate detailed charts, graphs, and interactive plots to understand your data and model performance intuitively based on user's Selection."
    },
    {
      icon: "📋",
      title: "Comprehensive Reporting",
      description: "Receive detailed PDF reports summarizing the entire AutoML process, from data cleaning to model selection and insights."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Your Dataset",
      description: "Simply upload your CSV or Excel file. Our system automatically detects the structure and prepares it for analysis."
    },
    {
      number: "02",
      title: "Automatic Data Cleaning",
      description: "We handle missing values, remove duplicates, and detect outliers to ensure your data is analysis-ready."
    },
    {
      number: "03",
      title: "Exploratory Analysis",
      description: "Get comprehensive insights with statistical summaries, correlation matrices, and interactive visualizations."
    },
    {
      number: "04",
      title: "Data Preprocessing",
      description: "Our system automatically processes and optimizes features for machine learning model training."
    },
    {
      number: "05",
      title: "Model Training & Selection",
      description: "We train multiple models, optimize hyperparameters, and select the best performing model for your data."
    },
    {
      number: "06",
      title: "Results & Insights",
      description: "Receive detailed reports, visualizations, and downloadable models with comprehensive performance metrics."
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <span className="text-4xl">🤖</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">AutoML Pro</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Revolutionizing machine learning with our automated pipeline that transforms raw data into powerful insights and predictive models.
          </p>
        </div>

        {/* What We Do Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">What We Do</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Our AutoML platform automates the entire machine learning workflow, making advanced data science accessible to everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-gray-700 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Our streamlined process takes you from raw data to actionable insights in just a few clicks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 hover:shadow-lg transition-all relative">
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose AutoML Pro?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-semibold text-white mb-4">For Data Scientists</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
                  <span>Accelerate model development and experimentation</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
                  <span>Automate repetitive data preprocessing tasks</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
                  <span>Compare multiple models quickly and efficiently</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
                  <span>Generate comprehensive reports for stakeholders</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-semibold text-white mb-4">For Business Users</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></span>
                  <span>No coding or machine learning expertise required</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></span>
                  <span>Quickly derive insights from your data</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></span>
                  <span>Make data-driven decisions with confidence</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></span>
                  <span>Scale your analytics capabilities without additional resources</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 p-8 rounded-2xl border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of users who are transforming their data into actionable insights with AutoML Pro.
            </p>
            <Link
              to="/"
              className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all inline-block shadow-lg"
            >
              Start Your AutoML Journey
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}