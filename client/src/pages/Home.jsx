import { useEffect, useState } from 'react'

// redux states
import { useDispatch } from 'react-redux'
import { setNotification } from '../redux/notificationSlice.js'

// components
import { Alert, Loader, ListingCard } from '../components/index.js'

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
    <div className='main'>
      {/* home */}

      <Alert />
      <div className='w-full mx-4 md:h-[70vh] flex flex-col gap-5 md:px-10 justify-center min-h-[80vh]'>

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

        <h1 className='main-heading'>Popular Places</h1>
        <div className="flex flex-col sm:flex-row flex-wrap">
          {listings.length === 0 ? (
            <Loader />
          ) : (
            // {/* all listings */}
            listings.map((listing) =>
              <div key={listing._id} className='px-2 my-3 w-full sm:w-1/2 md:w-1/3 '>
                {/* listing card */}

                <ListingCard listing={listing} />
                
              </div >
            )
          )
          }
        </div >
      </div >
    </div >
  )
}
export default Home





