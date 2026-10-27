// the entry point of the app: vite loads this file first (see index.html)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// global styles that apply to the whole app
import './styles/index.css'
import App from './App.jsx'

// finds the <div id="root"> in index.html and renders the whole app inside of it
// StrictMode only runs extra checks while developing, it does not change how the app looks
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)