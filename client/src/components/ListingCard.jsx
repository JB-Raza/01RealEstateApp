import { Link } from 'react-router-dom'

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'


function ListingCard({ listing }) {
  
  const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + "..." : text
  }

  return (
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
  )
}

export default ListingCard
