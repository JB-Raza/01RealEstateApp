import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Home, About, SignIn, SignUp, Profile } from './pages/index.js'
import {Route, createBrowserRouter, RouterProvider, createRoutesFromElements} from 'react-router-dom'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} >
      <Route index element={<Home />} />
      <Route path='about' element={<About />} />
      <Route path='profile' element={<Profile />} />
      <Route path='signin' element={<SignIn />} />
      <Route path='signup' element={<SignUp />} />
      
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} >
    <App />
  </RouterProvider>,
)
