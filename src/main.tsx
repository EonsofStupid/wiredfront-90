import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AppLayout } from './components/layout/AppLayout'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppLayout>
        <App />
      </AppLayout>
    </BrowserRouter>
  </React.StrictMode>,
)