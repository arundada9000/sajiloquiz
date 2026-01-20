import { HashRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AnimatePresence } from 'framer-motion';
import GridPage from './pages/GridPage';
import QuestionPage from './pages/QuestionPage';
import AdminPage from './pages/AdminPage';

function App() {
    return (
        <HashRouter>
            <ScrollToTop />
            <AnimatePresence mode="wait">
                <Routes>
                    <Route path="/" element={<GridPage />} />
                    <Route path="/question/:id" element={<QuestionPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </AnimatePresence>
        </HashRouter>
    );
}

export default App;
