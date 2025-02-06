import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Home() {
  const { user } = useAuth();
  const [status, setStatus] = useState({});

  useEffect(() => {
    const checkServices = async () => {
      try {
        const userHealth = await axios.get('http://localhost:3000/health');
        const parserHealth = await axios.get('http://localhost:3001/health');
        const aiHealth = await axios.get('http://localhost:3002/health');
        
        setStatus({
          user: userHealth.data,
          parser: parserHealth.data,
          ai: aiHealth.data
        });
      } catch (err) {
        console.error('Service check error:', err);
      }
    };

    checkServices();
  }, []);

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Career Platform</h1>
      <p className="text-xl mb-12">
        Transform your resume with AI-powered optimization and professional rewriting
      </p>

      {user ? (
        <Link
          to="/dashboard"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600"
        >
          Go to Dashboard
        </Link>
      ) : (
        <div className="space-y-6">
          <Link
            to="/get-started"
            className="block w-64 mx-auto bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600"
          >
            Get Started
          </Link>
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-600">
              Login
            </Link>
          </p>
        </div>
      )}

      <div>
        <h1>Service Status</h1>
        <pre>{JSON.stringify(status, null, 2)}</pre>
      </div>
    </div>
  );
}

export default Home; 