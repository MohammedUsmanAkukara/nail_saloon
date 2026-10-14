import React from 'react';
import Button from './Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-[#F2DDE1]/60">
            <span className="text-4xl mb-4 block">✨</span>
            <h2 className="font-serif text-2xl text-[#252124] mb-2 font-medium">
              Something went wrong
            </h2>
            <p className="text-sm text-[#252124]/70 mb-6 font-light">
              We encountered an unexpected display issue. Please refresh or return to the salon home.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="primary" size="sm" onClick={this.handleReset}>
                Refresh Page
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  window.location.href = '/';
                }}
              >
                Return Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
