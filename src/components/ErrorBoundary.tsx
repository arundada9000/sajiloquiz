import { Component, ReactNode } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error("Uncaught render error:", error);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center text-[rgb(var(--text-primary))]">
          <div className="glass-panel p-8 md:p-12 max-w-md w-full">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[rgb(var(--danger))]/15 flex items-center justify-center mb-5">
              <AlertTriangle className="w-7 h-7 text-[rgb(var(--danger))]" />
            </div>
            <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
            <p className="text-[rgb(var(--text-secondary))] text-sm mb-3">
              An unexpected error occurred while rendering this screen. Even the
              best quiz masters drop a card now and then.
            </p>
            <p className="text-[rgb(var(--text-secondary))] text-sm mb-6">
              Good news: your quiz data is safe in this browser, so a reload
              usually sorts it right out.
            </p>
            <button
              onClick={this.handleReload}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
