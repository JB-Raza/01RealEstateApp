import { createRoot } from 'react-dom/client'
import { Home, About, SignIn, SignUp, Profile } from './pages/index.js'
import { Route, createBrowserRouter, RouterProvider, createRoutesFromElements } from 'react-router-dom'

import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'

import App from './App.jsx'
import './index.css'
import PrivateRoute from './components/PrivateRoute.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} >
      <Route index element={<Home />} />
      <Route path='about' element={<About />} />
      <Route path='signin' element={<SignIn />} />
      <Route path='signup' element={<SignUp />} />
      <Route element={<PrivateRoute />} >
        <Route path='profile' element={<Profile />} />
      </Route>

    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor} >
      <RouterProvider router={router} >

        <App />

      </RouterProvider>,
    </PersistGate>
  </Provider>
)
