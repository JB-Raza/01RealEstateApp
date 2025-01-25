import React, { useEffect, useState } from 'react'
import ReactStars from "react-rating-stars-component";
import { useParams } from 'react-router-dom'

// components
import { Loader, Alert, Slider } from '../components/index.js'
import { setNotification } from '../redux/notificationSlice.js'
import { useDispatch } from 'react-redux'
// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'


function Listing() {
  const [loading, setLoading] = useState(false)
  const [listing, setListing] = useState({})
  const [listingReviews, setListingReviews] = useState([])
  const [review, setReview] = useState({ rating: 0, comment: "" })
  const { id } = useParams()

  const dispatch = useDispatch()

  // fetch listing
  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch(`/api/listings/${id}`)
      if (res.ok) {
        const data = await res.json()
        setListing(data)
      }
    }
    fetchListing();
  }, [id])

  // fetch listing reviews
  useEffect(() => {
    const fetchListingReviews = async () => {
      try {
        const res = await fetch(`/api/listings/${id}/reviews/`);
        const data = await res.json();
  
        if (!data.success) {
          return dispatch(setNotification({ type: "failure", message: data.message }));
        }
  
        setListingReviews(data.reviews);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        dispatch(setNotification({ type: "failure", message: "Failed to fetch reviews." }));
      }
    };
  
    fetchListingReviews(); // Call the async function
  }, [id]);
  
  const handleReviewChange = (e) => {
    setReview({
      ...review,
      [e.target.id]: e.target.value
    })
  }

  // add review
  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await fetch(`/api/listings/${id}/reviews/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(review)
      })

      const data = await res.json()
      if (data.success) {
        dispatch(setNotification({ type: "success", message: data.message }))
        setLoading(false)
        return
      }
      // dispatch(setNotification({ type: "failure", message: data.message }))
      // setLoading(false)
      // return
    } catch (error) {
      dispatch(setNotification({ type: "failure", message: error.message }))
      setLoading(false)
    }
  }

  // adding loaders while page is not ready to render
  if (!listing.images) {
    return <Loader />
  }
  return (
    <div>
      <Alert />
      {/* slider */}
      <div className="banner bg-black">

        {/* available status */}
        <div className={`z-50 status absolute text-white rounded-full px-2 py-1 shadow-md hover:shadow-lg m-2 ${listing.availabilityStatus ? "bg-green-500" : "bg-red-500"}`}>
          {listing.availabilityStatus ? "Available" : "Not Available"}
        </div>

        {/* images slider */}
        <Slider images={listing.images} />

      </div>

      {/* other details */}
      <div className='max-w-[900px] mx-auto p-3'>
        <div className="details my-2 mx-4">

          {/* title & price */}
          <h1 className='text-xl md:text-2xl text-slate-900 dark:text-slate-200 font-semibold my-5'>
            {listing.title}  - Rs.<span> {listing.discount > 0 ? <span> <span className='line-through'>{listing.price}</span> {listing.price - listing.discount}</span> : listing.price} </span> {listing.rentOrSale == "rent" ? "/ night" : ""}</h1>

          <p className='text-slate-700 dark:text-slate-300 flex gap-3 items-center'><FontAwesomeIcon className='text-green-400 text-sm' icon={faLocationDot} /> {listing.address}</p>
          <div className='my-2 flex gap-2'>
            <p className={`capitalize w-full max-w-[200px] bg-green-900 rounded-md p-1 text-white text-center`}>For {listing.rentOrSale}</p>
            {listing.discount > 0 ? <p className={`capitalize w-full max-w-[200px] bg-red-900 rounded-md p-1 text-white text-center`}>Discount Rs. {listing.discount}</p> : ""}

          </div>
          {/* description */}
          <p className='my-3 text-slate-700 dark:text-slate-400'> <span className='font-bold text-lg text-slate-800 dark:text-slate-300'>Description - </span> {listing.description}</p>

          {/* facilities like swimming pool and parking etc. incomplete */}
          <div className="services flex mt-9 flex-wrap gap-3">
            {listing.services && listing.services.map((service, index) => (
              <div key={index} className='flex gap-3'>
                <p className='text-green-700 dark:text-green-500 font-semibold'>{service}</p><span className='dark:text-white'>|</span>
              </div>
            ))}
          </div>

          {/* contact landlord button incomplete */}
          <button className='uppercase font-semibold outline-none bg-slate-600 hover:bg-slate-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 mt-5 text-white w-full py-3 rounded-md'>contact landlord</button>
        </div>
      </div>

      {/* add reviews */}
      <form className='max-w-[900px] mx-auto p-7'
        onSubmit={handleReviewSubmit}
      >
        <h1 className='main-heading !text-3xl'>Add a reivew</h1>

        {/* rating */}
        <ReactStars
          count={5} size={35}
          isHalf={true} activeColor="#ffd700"
          onChange={(currRating) => setReview({ ...review, rating: currRating })}
        />

        {/* comment */}
        <textarea name="comment" id="comment"
          value={review.comment}
          onChange={handleReviewChange}
          placeholder='Write your reviews about this place to help others take a right decision'
          className='input-box focus:scale-100 invalid:border-red-400'
          minLength={10} rows={4} required
        ></textarea>
        <button className="main-button">{loading ? "Adding..." : "Add Review"}</button>
      </form>

      {/* show reviews */}
      <div className='max-w-[900px] mx-auto p-7'>
        <h1 className='main-heading !text-3xl'>Reviews</h1>
        <div className='flex flex-col sm:flex-row flex-wrap basis-1/2'>
          {listingReviews && listingReviews.map((review) => (
            <div key={review._id} className='w-full sm:w-1/2 p-2'>
              <div className="bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-400 py-3 px-5 rounded-md">
                <h3 className='font-semibold dark:text-slate-200'>By : {review.userRef.username}</h3>
                <div className="data mt-4">
                  <ReactStars
                    count={5} size={24}
                    edit={false} isHalf={true} activeColor="#ffd700"
                    value={review.rating}
                  />
                  <p>{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Listing