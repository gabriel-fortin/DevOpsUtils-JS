import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/components/app'

import './index.css'
import { installHello } from './hello'

installHello()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
