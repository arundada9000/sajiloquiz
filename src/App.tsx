import { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ScrollToTop from './components/ScrollToTop';
import GridPage from './pages/GridPage';
import QuestionPage from './pages/QuestionPage';
import NotFound from './pages/NotFound';
import Offline from './pages/Offline';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import UpdateDetector from './components/UpdateDetector';
import SidebarScoreboard from './components/SidebarScoreboard';
import ErrorBoundary from './components/ErrorBoundary';

// AdminPage is the largest bundle; load it lazily to speed up first paint.
const AdminPage = lazy(() => import('./pages/AdminPage'));

// Small fullscreen loading fallback while a lazy chunk loads.
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--separator)] border-t-[rgb(var(--color-primary))] animate-spin" />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<GridPage />} />
        <Route path="/question/:id" element={<QuestionPage />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  // With a hash router, a bare pathname like "/kaaaa" (no hash) would silently
  // fall back to the home route. Normalize before render so unknown paths show
  // the NotFound page instead of the grid.
  useEffect(() => {
    const { pathname, hash } = window.location;
    if (hash === '' && pathname !== '/') {
      window.location.replace('/#' + pathname.replace(/^\//, ''));
    }
  }, []);

  return (
    <HashRouter>
      <ErrorBoundary>
        <UpdateDetector />
        <SidebarScoreboard />
        <ScrollToTop />
        <AnimatedRoutes />
        <Offline />
      </ErrorBoundary>
    </HashRouter>
  );
}

export default App;
