import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QuizProvider } from './context/QuizContext.tsx'
import { DataProvider } from './context/DataContext.tsx'
import { DialogProvider } from './context/DialogContext.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DataProvider>
            <QuizProvider>
                <DialogProvider>
                    <App />
                </DialogProvider>
            </QuizProvider>
        </DataProvider>
    </StrictMode>,
)
