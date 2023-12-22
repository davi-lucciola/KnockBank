import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppRoutes as Routes } from './routes'


export default function App() {
  return (
    <>
      <Routes />
    </>
  )
}


ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
