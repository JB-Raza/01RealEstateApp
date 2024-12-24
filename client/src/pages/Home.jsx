import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
    <div className="mx-auto py-3 px-5 flex flex-col sm:flex-row flex-wrap max-w-[1400px]">
      {listings.map((listing) => (
        <div key={listing._id} className='px-1 py-3 w-full sm:w-1/2 md:w-1/3 xl:w-1/4'>
          <Link to={`/listings/${listing._id}`}>
            <div className="rounded-md shadow-lg bg-white hover:shadow-gray-400 h-full cursor-pointer overflow-hidden">
              <img className="w-full h-52 rounded-t-md" src={listing.images[0]} />
              <div className="px-4 py-3">
                <h3 className="font-bold text-xl mb-2">{listing.title}</h3>
                <p className="text-gray-700 text-base"><b>Contact:</b> {listing.contact}</p>
                <p className="text-gray-700 text-base">{listing.address}</p>
                <div className="text-gray-700 text-base mt-auto">
                  <div className="flex justify-between">
                    <p className='text-base'>
                      <b>Price: </b>
                      <span className={`${listing.discountedPrice ? "line-through" : ""}`}>
                        Rs.{listing.price}/night
                      </span>
                    </p>
                    <span className={`${listing.discountedPrice ? "" : "hidden"}`}>Rs.{listing.discountedPrice}/night</span>
                  </div>
                </div>

              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )


}
export default Home
