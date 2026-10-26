import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// @ts-expect-error CSS is loaded by the bundler and has no TypeScript declarations.
import 'bootstrap/dist/css/bootstrap.min.css';
//*quiere decir que todavia eso no tiene una declaracion en typescript

import { BrowserRouter } from 'react-router-dom';

/*el signo de admiracion ! le obliga a no ser null */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </StrictMode>
)
