import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Users, BarChart3, CheckCircle } from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: "Easy Form Creation",
      description: "Build custom feedback forms with multiple question types in minutes"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Public Sharing",
      description: "Share forms with anyone using simple, shareable links"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      title: "Analytics & Insights",
      description: "Get detailed analytics and export responses to CSV"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-orange-600" />,
      title: "Real-time Responses",
      description: "See responses as they come in with real-time updates"
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center py-20">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Collect Feedback
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {' '}Beautifully
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Create stunning feedback forms, collect responses, and analyze data with our powerful platform. 
          Perfect for surveys, reviews, and customer feedback collection.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-gray-300"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gray-50 rounded-lg mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Collecting Feedback?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of businesses using FeedbackHub to improve their products and services.
        </p>
        {!isAuthenticated && (
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Create Your First Form
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;