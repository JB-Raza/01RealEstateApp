import React from 'react'
import { useLocation } from 'react-router-dom'
import { ListingCard, Loader } from '../components/index.js'

function SearchPage() {

  const location = useLocation()
  const listings = location.state.listings || []
  console.log(listings)

  return (
    <div className="container flex flex-wrap px-10 my-10 max-w-[1250px] mx-auto">
      {listings && listings.map((listing) => (
        <div key={listing._id} className='px-2 my-3 w-full sm:w-1/2 md:w-1/3 '>
          <ListingCard listing={listing} />
        </div>
      ))}
    </div>
  )
}

export default SearchPage