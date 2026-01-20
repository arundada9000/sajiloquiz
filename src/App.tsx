import { HashRouter, Routes, Route } from 'react-router-dom';
import GridPage from './pages/GridPage';
import QuestionPage from './pages/QuestionPage';

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<GridPage />} />
                <Route path="/question/:id" element={<QuestionPage />} />
            </Routes>
        </HashRouter>
    );
}

export default App;
