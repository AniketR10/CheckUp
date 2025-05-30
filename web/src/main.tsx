import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Root from './Root'
 // import ManageTraige from './ManageTraige'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ManageTriage from './pages/ManageTraige';
import { LiveQueue } from './pages/LiveQueue/LiveQueue'

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    children: [
      {
        index: true,
        path: "/",
        element: <LiveQueue/>
      },
      {
        path: "/triage",
        element: <ManageTriage/>
      } 
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}></RouterProvider>
    </QueryClientProvider>
  </StrictMode>,
)