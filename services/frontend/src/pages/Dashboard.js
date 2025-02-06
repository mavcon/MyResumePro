import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ErrorBoundary from "../components/ErrorBoundary";

const API_URLS = {
  parser: process.env.REACT_APP_PARSER_SERVICE_URL,
  ai: process.env.REACT_APP_AI_SERVICE_URL,
  payment: process.env.REACT_APP_PAYMENT_SERVICE_URL,
};

// Validate required environment variables
Object.entries(API_URLS).forEach(([service, url]) => {
  if (!url) {
    console.error(`Missing REACT_APP_${service.toUpperCase()}_SERVICE_URL environment variable`);
    API_URLS[service] = `http://localhost:${service === 'parser' ? 3001 : service === 'ai' ? 3002 : 3003}`;
  }
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const usePreventCopy = () => {
  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
    const element = document.getElementById('parsed-data');
    if (element) {
      element.addEventListener('copy', preventDefault);
      element.addEventListener('cut', preventDefault);
      element.addEventListener('paste', preventDefault);
      return () => {
        element.removeEventListener('copy', preventDefault);
        element.removeEventListener('cut', preventDefault);
        element.removeEventListener('paste', preventDefault);
      };
    }
  }, []);
};

function Dashboard() {
  const { token } = useAuth();
  usePreventCopy();
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [credits, setCredits] = useState(0);

  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchSubscriptionData = async () => {
      try {
        const response = await axios.get(`${API_URLS.payment}/api/payment/subscription`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (mounted) {
          setSubscription(response.data.subscription);
          setCredits(response.data.credits);
        }
      } catch (err) {
        console.error("Error fetching subscription:", err);
        if (mounted) {
          setError("Failed to load subscription data");
        }
      } finally {
        if (mounted) {
          setSubscriptionLoading(false);
        }
      }
    };

    fetchSubscriptionData();
    return () => {
      mounted = false;
    };
  }, [token]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!file) {
      setError("Please select a file");
      setLoading(false);
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("Invalid file type. Please upload a PDF or DOCX file");
      setLoading(false);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 5MB limit");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axios.post(`${API_URLS.parser}/api/parser/parse-resume`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setParsedData(response.data.data);
    } catch (err) {
      console.error("Parser error:", err);
      setError(err.response?.data?.message || "Error parsing resume");
    } finally {
      setLoading(false);
    }
  };

  const handleAIRewrite = async () => {
    if (!parsedData) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_URLS.ai}/api/ai/rewrite-profile`,
        { profile: parsedData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setParsedData(response.data.data);
    } catch (err) {
      console.error("AI error:", err);
      setError(err.response?.data?.message || "Error rewriting profile");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async () => {
    // This will be implemented later with QR generation
    console.log("QR generation coming soon");
  };

  const handleUpgradeSubscription = async () => {
    try {
      const response = await axios.post(
        `${API_URLS.payment}/api/payment/create-subscription`,
        { planId: "pro" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (err) {
      setError(err.response?.data?.message || "Error upgrading subscription");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8" aria-busy={subscriptionLoading}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">Subscription Status</h2>
            {subscriptionLoading ? (
              <div className="animate-pulse h-6 w-48 bg-gray-200 rounded"></div>
            ) : (
              <p className="text-gray-600">
                Plan: {subscription?.plan || "Free"}
                <span className="mx-2">•</span>
                Credits: {credits}
              </p>
            )}
          </div>
          {(!subscription || subscription.plan === "free") && (
            <button
              onClick={handleUpgradeSubscription}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Upgrade Plan
            </button>
          )}
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8">Resume Parser</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleFileUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Resume (PDF/DOCX)
            </label>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="mt-1 block w-full"
            />
          </div>
          <button
            type="submit"
            disabled={!file || loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Parse Resume"}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {parsedData && (
        <div className="bg-white p-6 rounded-lg shadow-md" aria-busy={loading}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Parsed Data</h2>
            <button
              onClick={handleAIRewrite}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? "Processing..." : "AI Rewrite"}
            </button>
          </div>
          <ErrorBoundary fallback={<div className="text-red-600">Error displaying parsed data</div>}>
            <div
              id="parsed-data"
              className="bg-gray-50 p-4 rounded overflow-auto relative"
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
              role="region"
              aria-label="Parsed Resume Data"
            >
            <div className="absolute top-2 right-2 space-x-2">
              <button
                onClick={handleGenerateQR}
                className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                aria-label="Generate QR Code"
              >
                Generate Secure QR
              </button>
            </div>
            <pre className="disable-selection whitespace-pre-wrap break-words">
              {JSON.stringify(parsedData, null, 2)}
            </pre>
            </div>
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
