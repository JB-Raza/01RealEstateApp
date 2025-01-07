import { createRoot } from 'react-dom/client'

import { Loader, PrivateRoute } from './components/index.js'

// router imports
import { Route, createBrowserRouter, RouterProvider, createRoutesFromElements } from 'react-router-dom'

// pages
import {Home, About, Profile, SignIn, SignUp, AddListing, Listing} from './pages/index.js'

import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'

import App from './App.jsx'
import './index.css'

// all routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} >
      <Route index element={<Home />} />
      <Route path='about' element={<About />} />
      <Route path='signin' element={<SignIn />} />
      <Route path='signup' element={<SignUp />} />
      <Route path='listings'>
        <Route path=':id' element={<Listing />} />
        <Route path=':id/update' element={<AddListing />} />
        <Route path='new' element={<AddListing />} />
      </Route>
      <Route element={<PrivateRoute />} >
        <Route path='profile' element={<Profile />} />
      </Route>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  // redux state provider
  <Provider store={store}>
    {/* persisting the state */}
    <PersistGate loading={ <Loader/> /*you can pass null*/} persistor={persistor} >
      {/* for routing */}
      <RouterProvider router={router} /> {/* this automatically renders App.jsx (but import of App.jsx is required)*/}
    </PersistGate>
  </Provider>
)