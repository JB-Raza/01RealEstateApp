import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'

function Home() {

  const [listings, setListings] = useState([])

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
      {/* home */}
      <div className='home w-full mx-4 md:h-[70vh] flex flex-col gap-5 md:px-10 justify-center min-h-[60vh]'>
        <h1 className='text-2xl sm:text-4xl md:text-5xl font-bold text-slate-600'>Find your next <span className='text-slate-800'>Perfect</span> <br /> place with ease</h1>
        <p className='text-slate-500 text-xs sm:text-sm'>Real<b>Estate</b> will help you find your home fast, easy and comfortable. <br />
          Our expert support are always available.</p>
        <span className='text-blue-900 font-bold cursor-pointer'>Lets start now...</span>
      </div>

      {/* banner slider incomplete */}
      <div className='banner'>
        <img src="https://plus.unsplash.com/premium_photo-1661962571049-792ae9be2d79?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className='w-[100vw] p-0 m-0 max-h-[100vh]'
        />
      </div>
      {/* all listings */}
      <div className="container px-10 my-10 max-w-[1250px] mx-auto">

        <h1 className='my-6 mx-3 text-3xl font-semibold text-slate-600'>Popular Places</h1>
        <div className="flex flex-col sm:flex-row flex-wrap">
          {listings.map((listing) => (
            <div key={listing._id} className='px-2 my-3 w-full sm:w-1/2 md:w-1/3 '>

              <Link to={`/listings/${listing._id}`}>
                <div className="rounded-md shadow-lg bg-white hover:shadow-gray-400 h-full max-w-[380px] mx-auto cursor-pointer overflow-hidden">
                  <img className="w-full h-52 rounded-t-md hover:scale-105 transition-all duration-200" src={listing.images[0]} />
                  <div className="px-4 py-3 flex flex-col gap-2">
                    {/* title */}
                    <h3 className="font-semibold text-slate-800 text-md">{listing.title.length > 30 ? `${listing.title.slice(0, 30)}...` : listing.title}</h3>
                    {/* address */}
                    <p className=' text-xs text-slate-700 flex gap-1 font-semibold items-center'>
                      <FontAwesomeIcon className='text-green-600 text-sm' icon={faLocationDot} /> {listing.address.length > 35 ? `${listing.address.slice(0, 35)}...` : listing.address}</p>
                    {/* description */}
                    <p className='text-xs'>{listing.description.length > 90 ?
                      `${listing.description.slice(0, 90)}...` : listing.description
                    }</p>

                    <div className='flex flex-col justify-between gap-2'>
                      {/* price */}
                      <p className="text-gray-700 text-base">Rs.{listing.price} {listing.rentOrSale == "rent" ? " / night" : ""} </p>
                      {/* rentOrSale and availability */}
                      <div className='flex justify-between items-center my-2'>
                        {/* rentOrSale */}
                        <span className={`${listing.availabilityStatus ? "bg-green-800" : "bg-red-800"} rounded-md text-white text-center py-1 px-2`}>
                          {listing.availabilityStatus ? "Available" : "Not Available"}
                        </span>
                        {/* discount */}
                        {listing.discountedPrice > 0 ?
                          <span className={`bg-red-800 rounded-md text-white text-center py-1 px-2`}>
                            Rs. {listing.discountedPrice} OFF
                          </span> : ""}
                      </div>
                    </div>


                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  )


}
export default Home
