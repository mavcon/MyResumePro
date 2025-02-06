import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import SignupProgress from "../../components/SignupProgress";

function LinkedInSignup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [linkedInData, setLinkedInData] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    title: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLinkedInAuth = async () => {
    // In a real implementation, this would use LinkedIn OAuth
    // For now, we'll simulate the LinkedIn import
    setLoading(true);
    try {
      const mockLinkedInData = {
        name: "John Doe",
        title: "Software Engineer",
        experience: [
          {
            company: "Tech Corp",
            title: "Senior Developer",
            duration: "2020 - Present"
          }
        ],
        education: [
          {
            school: "University of Technology",
            degree: "Computer Science",
            year: "2020"
          }
        ]
      };
      
      setLinkedInData(mockLinkedInData);
      setFormData(prev => ({
        ...prev,
        name: mockLinkedInData.name,
        title: mockLinkedInData.title,
      }));
      setStep(2);
    } catch (err) {
      setError("Failed to import LinkedIn profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const signupResponse = await axios.post(
        `${process.env.REACT_APP_USER_SERVICE_URL}/api/auth/register`,
        {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          professionalProfile: linkedInData
        }
      );

      login(signupResponse.data.user, signupResponse.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Error creating account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto py-12"
    >
      <SignupProgress 
        currentStep={step} 
        totalSteps={2} 
        labels={["Connect LinkedIn", "Complete Profile"]} 
      />

      {step === 1 ? (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-6">Connect with LinkedIn</h2>
          <p className="text-gray-600 mb-6">
            Import your professional experience directly from LinkedIn
          </p>
          <button
            onClick={handleLinkedInAuth}
            disabled={loading}
            className="w-full bg-[#0077b5] text-white py-2 px-4 rounded hover:bg-[#006397] disabled:opacity-50"
          >
            {loading ? "Connecting..." : "Connect with LinkedIn"}
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
          <form onSubmit={handleSignup}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 mt-6"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
}

export default LinkedInSignup;
