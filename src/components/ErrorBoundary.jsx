
import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError
      ? <h3 className="text-danger">Something went wrong.</h3>
      : this.props.children;
  }
}

export default ErrorBoundary;
