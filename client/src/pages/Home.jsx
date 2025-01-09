import { useEffect, useState, Suspense } from 'react'
import { Link } from 'react-router-dom'

// redux states
import { useDispatch } from 'react-redux'
import { setNotification } from '../redux/notificationSlice.js'

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'

// components
import Alert from '../components/Alert'
import Loader from '../components/Loader.jsx'

function Home() {

  const [listings, setListings] = useState([])
  const dispatch = useDispatch()
  // welcome notification
  let welcomeNotification = localStorage.getItem("welcomeNotification")
  useEffect(() => {
    if (!welcomeNotification) {
      dispatch(setNotification({ type: "Welcome", message: "Welcome to RealEstate" }))
      localStorage.setItem("welcomeNotification", "true")
    }
  }, [])

  const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + "..." : text
  }

  const allListings = async () => {
    const res = await fetch("/api/listings/", {
      method: "GET",
      headers: {
        "Content-Type": "Application/json"
      }
    })
    const data = await res.json()
    setListings(data)
  }
  useEffect(() => {
    allListings()
  }, [])

  return (
    <div className='main overflow-hidden'>
      <Alert />
      {/* home */}
      <div className='home w-full mx-4 md:h-[70vh] flex flex-col gap-5 md:px-10 justify-center min-h-[60vh]'>
        <h1 className='text-2xl sm:text-4xl md:text-5xl font-bold text-slate-600 dark:text-slate-500'>Find your next <span className='text-slate-800 dark:text-slate-200'>Perfect</span> <br /> place with ease</h1>
        <p className='text-slate-500 dark:text-slate-400 text-xs sm:text-sm'>Real<b>Estate</b> will help you find your home fast, easy and comfortable. <br />
          Our expert support are always available.</p>
        <span className='text-indigo-500 hover:text-indigo-700 font-bold cursor-pointer'>Lets start now...</span>
      </div>

      {/* banner slider incomplete */}
      <div className='banner'>
        <img src="https://plus.unsplash.com/premium_photo-1661962571049-792ae9be2d79?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className='w-[100vw] p-0 m-0 max-h-[100vh]'
        />
      </div>

      <div className="container px-10 my-10 max-w-[1250px] mx-auto">

{/*classes of popular places:  my-6 mx-3 text-3xl font-bold text-slate-800 dark:text-slate-300 */}
        <h1 className='main-heading'>Popular Places</h1>
        <div className="flex flex-col sm:flex-row flex-wrap">
          {listings.length === 0 ? (
            <Loader />
          ) : (
            // {/* all listings */}
            listings.map((listing) => (
              <div key={listing._id} className='px-2 my-3 w-full sm:w-1/2 md:w-1/3 '>
                {/* listing card */}
                <Link to={`/listings/${listing._id}`}>
                  <div className="rounded-md shadow-lg bg-white hover:shadow-gray-400 h-full max-w-[380px] mx-auto cursor-pointer overflow-hidden dark:bg-slate-800 dark:hover:shadow-slate-700 dark:shadow-md">
                    <img className="w-full h-52 rounded-t-md hover:scale-105 transition-all duration-200" src={listing.images[0]} />
                    <div className="px-4 py-3 flex flex-col gap-2">
                      {/* title */}
                      <h3 className="font-semibold text-slate-900 dark:text-slate-200 text-md">{truncateText(listing.title, 30)}</h3>
                      {/* address */}
                      <p className=' text-xs text-slate-800 dark:text-slate-300 flex gap-1 font-semibold items-center'>
                        <FontAwesomeIcon className='text-green-600 text-sm' icon={faLocationDot} /> {truncateText(listing.address, 35)}</p>
                      {/* description */}
                      <p className='text-xs text-slate-600 dark:text-slate-400'>{truncateText(listing.description, 110)}</p>

                      <div className='flex flex-col justify-between gap-2'>
                        {/* price */}
                        <p className="text-gray-900 dark:text-slate-200 font-semibold text-base">Rs.{listing.price} {listing.rentOrSale == "rent" ? " / night" : ""} </p>
                        {/* rentOrSale and availability */}
                        <div className='flex justify-between items-center my-2'>
                          {/* rentOrSale */}
                          <span className={`${listing.availabilityStatus ? "bg-green-700" : "bg-red-700"} rounded-md text-white text-center py-1 px-2`}>
                            {listing.availabilityStatus ? "Available" : "Not Available"}
                          </span>
                          {/* discount */}
                          {listing.discount > 0 ?
                            <span className={`bg-red-800 rounded-md text-white text-center py-1 px-2`}>
                              Rs. {listing.discount} OFF
                            </span> : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
export default Home