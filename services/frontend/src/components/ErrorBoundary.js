import React from 'react';
import * as Sentry from '@sentry/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    
    // Log error to your preferred error tracking service
    this.logError(error, errorInfo);
  }

  logError = (error, errorInfo) => {
    Sentry.withScope((scope) => {
      scope.setExtras({
        componentStack: errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
      Sentry.captureException(error);
    });

    // Keep console logging in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', {
        error: error,
        componentStack: errorInfo?.componentStack
      });
    }
  };

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise show default error UI
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          resetError: this.resetError
        });
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="max-w-lg w-full mx-4">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">
                  Something went wrong
                </h1>
                {process.env.NODE_ENV === 'development' && (
                  <div className="mb-4 text-left">
                    <p className="text-gray-700 font-medium mb-2">Error Details:</p>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-40">
                      {this.state.error?.toString()}
                      {'\n'}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                )}
                <div className="space-x-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    onClick={() => window.location.reload()}
                  >
                    Reload Page
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                    onClick={this.resetError}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
