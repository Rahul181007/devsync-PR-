import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/tailwind.css'
import { Provider } from 'react-redux'
import { store } from './store/index.ts'
import { GoogleOAuthProvider } from '@react-oauth/google'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>

  </StrictMode>,
)
