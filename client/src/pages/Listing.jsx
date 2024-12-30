import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'


function Listing() {
  const [listing, setListing] = useState({})
  const { id } = useParams()

  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch(`/api/listings/${id}`)
      if (res.ok) {
        const data = await res.json()
        setListing(data)
      }
    }
    fetchListing();
  }, [])

  return (
    <div>
      {/* slider */}
      <div className="banner bg-black">
        <div className={`status absolute text-white rounded-full px-2 py-1 shadow-md hover:shadow-lg m-2 ${listing.availabilityStatus ? "bg-green-500" : "bg-red-500"}`}>
          {listing.availabilityStatus ? "Available" : "Not Available"}
        </div>
        {listing.images && listing.images[0] ?
          <img src={listing.images[0]} alt="banner"
            className='w-full max-h-[80vh] object-cover'
          /> : "No image found"
        }
      </div>
      {/* other details */}
      <div className='max-w-[900px] mx-auto p-3'>
        <div className="details my-2 mx-4">

          {/* title & price */}
          <h1 className='text-xl md:text-2xl text-slate-900 font-semibold my-5'>
            {listing.title}  - Rs.<span> {listing.discountedPrice > 0? <span> <span className='line-through'>{listing.price}</span> {listing.price - listing.discountedPrice}</span>: listing.price} </span> {listing.rentOrSale=="rent"?"/ night":""}</h1>

          <p className='text-slate-700 flex gap-3 items-center'><FontAwesomeIcon  className='text-green-400 text-sm' icon={faLocationDot} /> {listing.address}</p>
        <div className='my-2 flex gap-2'>
          <p className={`capitalize w-full max-w-[200px] bg-green-900 rounded-md p-1 text-white text-center`}>For {listing.rentOrSale}</p>
          {listing.discountedPrice > 0? <p className={`capitalize w-full max-w-[200px] bg-red-900 rounded-md p-1 text-white text-center`}>Discount Rs. {listing.discountedPrice}</p>:""}
          
        </div>
        {/* description */}
          <p className='my-3 text-slate-700'> <span className='font-bold text-lg text-slate-800'>Description - </span> {listing.description}</p>

          {/* facilities like swimming pool and parking etc. incomplete */}
          <div className="services flex mt-9 flex-wrap gap-3">
            {listing.services && listing.services.map((service, index) => (
              <div key={index} className='flex gap-3'>
              <p className='text-green-700 font-semibold'>{service}</p>|
              </div>
            ))}
          </div>

          {/* contact landlord incomplete */}
          <button className='uppercase outline-none bg-slate-600 hover:bg-slate-700 mt-5 text-white w-full py-3 rounded-md'>contact landlord</button>
        </div>
        
      </div>
    </div>
  )
}

export default Listing