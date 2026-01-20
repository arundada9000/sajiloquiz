import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QuizProvider } from './context/QuizContext.tsx'
import { DataProvider } from './context/DataContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DataProvider>
            <QuizProvider>
                <App />
            </QuizProvider>
        </DataProvider>
    </StrictMode>,
)
