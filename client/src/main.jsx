import { createRoot } from 'react-dom/client'
import { Loader, PrivateRoute } from './components/index.js'

import {Suspense, lazy} from 'react'

// router imports
import { Route, createBrowserRouter, RouterProvider, createRoutesFromElements } from 'react-router-dom'

// pages

// import {Home, About, Profile, SignIn, SignUp, AddListing, Listing, SearchPage} from './pages/index.js'

const Home = lazy(() => import('./pages/Home.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const SignIn = lazy(() => import('./pages/SignIn.jsx'))
const SignUp = lazy(() => import('./pages/SignUp.jsx'))
const AddListing = lazy(() => import('./pages/AddListing.jsx'))
const Listing = lazy(() => import('./pages/Listing.jsx'))
const SearchPage = lazy(() => import('./pages/SearchPage.jsx'))

import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'

import App from './App.jsx'
import './index.css'

const queryParams = new URLSearchParams(window.location.search).toString()

// all routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} >
      <Route index element={<Home />} />
      <Route path='about' element={<About />} />
      <Route path='signin' element={<SignIn />} />
      <Route path='signup' element={<SignUp />} />
      <Route path={`search?${queryParams}`} element={<SearchPage />} />
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
  <Suspense fallback={<Loader/>}>
  <Provider store={store}>
    <PersistGate loading={ <Loader/> /*you can pass null*/} persistor={persistor} >
      <RouterProvider router={router} /> {/* this automatically renders App.jsx (but import of App.jsx is required)*/}
    </PersistGate>
  </Provider>
  </Suspense>
)