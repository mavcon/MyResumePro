import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import DragDropUpload from "../../components/DragDropUpload";
import SignupProgress from "../../components/SignupProgress";

function ResumeUploadSignup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    title: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const uploadData = new FormData();
    uploadData.append("resume", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_PARSER_SERVICE_URL}/api/parser/parse-resume`,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setParsedData(response.data.data);
      setFormData(prev => ({
        ...prev,
        name: response.data.data.name || "",
        title: response.data.data.title || "",
      }));
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Error parsing resume");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Register user
      const signupResponse = await axios.post(
        `${process.env.REACT_APP_USER_SERVICE_URL}/api/auth/register`,
        {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          professionalProfile: parsedData,
        }
      );

      // Log user in
      login(signupResponse.data.user, signupResponse.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Error creating account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <SignupProgress 
        currentStep={step} 
        totalSteps={2} 
        labels={["Upload Resume", "Complete Profile"]} 
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {step === 1 ? (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Upload Your Resume</h2>
            <form onSubmit={handleFileUpload}>
              <div className="mb-6">
                <DragDropUpload
                  onFileSelect={(selectedFile) => setFile(selectedFile)}
                  loading={loading}
                />
              </div>
              <button
                type="submit"
                disabled={!file || loading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Continue"}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md">
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
          </div>
        )}
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}

export default ResumeUploadSignup; 