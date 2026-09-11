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
import GlobalContextMenu from './components/GlobalContextMenu';
import PageSkeleton from './components/PageSkeleton';

// AdminPage + Guide/Journal pages are the largest bundles; load them lazily.
const AdminPage = lazy(() => import('./pages/AdminPage'));
const GuidePage = lazy(() => import('./pages/GuidePage'));
const JournalIndexPage = lazy(() => import('./pages/JournalIndexPage'));
const JournalArticlePage = lazy(() => import('./pages/JournalArticlePage'));

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
            <Suspense fallback={<PageSkeleton variant="admin" />}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route
          path="/guide"
          element={
            <Suspense fallback={<PageSkeleton variant="content" />}>
              <GuidePage />
            </Suspense>
          }
        />
        <Route
          path="/journal"
          element={
            <Suspense fallback={<PageSkeleton variant="content" />}>
              <JournalIndexPage />
            </Suspense>
          }
        />
        <Route
          path="/journal/:slug"
          element={
            <Suspense fallback={<PageSkeleton variant="content" />}>
              <JournalArticlePage />
            </Suspense>
          }
        />
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
        <GlobalContextMenu />
        <AnimatedRoutes />
        <Offline />
      </ErrorBoundary>
    </HashRouter>
  );
}

export default App;
