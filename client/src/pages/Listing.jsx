import React, { useEffect, useState } from 'react'
import ReactStars from "react-rating-stars-component";
import { useParams } from 'react-router-dom'

// redux state
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from '../redux/notificationSlice.js'

// components
import { Loader, Alert, Slider } from '../components/index.js'

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faTrash, faPen } from '@fortawesome/free-solid-svg-icons'

function Listing() {
  const [loading, setLoading] = useState(false)
  const [listing, setListing] = useState({})
  const [listingReviews, setListingReviews] = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const [review, setReview] = useState({ reviewId: null, rating: 0, comment: "" })
  const { id } = useParams()

  const currUser = useSelector((state) => state.user.currentUser)
  const dispatch = useDispatch()


  // fetch listing
  const fetchListing = async () => {
    const res = await fetch(`/api/listings/${id}`)
    if (res.ok) {
      const data = await res.json()
      setListing(data)
    }
  }
  useEffect(() => {
    fetchListing();
  }, [id])

  // fetch listing reviews
  const fetchListingReviews = async () => {
    try {
      const res = await fetch(`/api/listings/${id}/reviews/`);
      const data = await res.json();

      if (!data.success) {
        dispatch(setNotification({ type: "failure", message: data.message }));
        return
      }
      setListingReviews(data.reviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      dispatch(setNotification({ type: "failure", message: "Failed to fetch reviews." }));
    }
  };
  useEffect(() => {
    fetchListingReviews(); // Call the async function
  }, [id]);

  // calculate average rating
  const calculateAverageRating = () => {
    if (listingReviews.length === 0) {
      return 0;
    }
    const totalRating = listingReviews.reduce((total, review) => total + review.rating, 0);
    setAvgRating(totalRating / listingReviews.length);
  }
  useEffect(() => {
    calculateAverageRating()
  }, [listingReviews])

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: review.rating,
          comment: review.comment
        })
      })
      const data = await res.json()
      if (data.success) {
        dispatch(setNotification({ type: "success", message: data.message }))
        setLoading(false)
        return
      }
    } catch (error) {
      dispatch(setNotification({ type: "failure", message: error.message }))
      setLoading(false)
    }
  }
  // update review
  const handleUpdateReview = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await fetch(`/api/listings/${id}/reviews/edit/${review.reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: review.rating,
          comment: review.comment,
        })
      })
      const data = await res.json()
      if (data.success) {
        dispatch(setNotification({ type: "success", message: data.message }))
        setLoading(false)
        return
      }
    } catch (error) {
      dispatch(setNotification({ type: "failure", message: error.message }))
      setLoading(false)
    }
  }

  // delete review
  const handleDelReview = async (reviewId) => {
    try {
      const res = await fetch(`/api/listings/${id}/reviews/delete/${reviewId}`, {
        method: "DELETE"
      })
      const data = await res.json()
      if (data.success) {
        dispatch(setNotification({ type: "success", message: data.message }))
        setListingReviews(prev => {
          return prev.filter(review => review._id !== reviewId)
        })
        return
      }
      dispatch(setNotification({ type: "failure", message: data.message }))
    } catch (error) {
      dispatch(setNotification({ type: "failure", message: error.message }))
    }
  }

  // adding loaders while page is not ready to render
  if (!listing.images) return <Loader />

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
        onSubmit={review.reviewId ? handleUpdateReview : handleReviewSubmit}
      >
        <h1 className='main-heading'>{review.reviewId ? "Update Review" : "Add a new Review"}</h1>

        {/* rating */}
        <ReactStars
          key={review.rating}
          count={5} size={35}
          isHalf={true} activeColor="#ffd700"
          value={review.rating}
          onChange={(newRating) => setReview({ ...review, rating: newRating })}
        />

        {/* comment */}
        <textarea name="comment" id="comment"
          value={review.comment}
          onChange={handleReviewChange}
          placeholder='Write your reviews about this place to help others take a right decision'
          className='input-box focus:scale-100 invalid:border-red-400'
          minLength={10} rows={4} required
        ></textarea>
        <button className="main-button">{loading ? "Loading..." : review.reviewId ? "Update Review" : "Add Review"}</button>
      </form>
      {/* show reviews */}
      <div className='max-w-[900px] mx-auto p-7'>
        <h1 className='main-heading !text-3xl'>Reviews</h1>
        {avgRating > 0 ?
          <div className="avg-reviews flex items-center gap-4 my-3">
            <ReactStars count={5} size={24}
              edit={false} isHalf={true} activeColor="#ffd700"
              value={avgRating}
            />
            <p className='text-slate-600 dark:text-slate-400 font-semibold text-sm sm:text-lg'>{listingReviews.length} Reviews</p>
          </div>
          : ""
        }
        <div className='flex flex-col sm:flex-row flex-wrap'>
          {listingReviews && listingReviews.map((review) => (
            <div key={review._id} className='w-full sm:w-1/2 p-2'>
              <div className="bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-400 py-3 px-5 rounded-md">
                <div className='flex justify-between'>
                  <h3 className='font-semibold dark:text-slate-200'>By : {review.userRef.username}</h3>
                  {currUser && currUser._id !== review.userRef._id ? "" :
                    <div className='text black dark:text-white flex gap-3'>
                      <FontAwesomeIcon icon={faPen}
                        onClick={() => setReview({ reviewId: review._id, rating: review.rating, comment: review.comment })}
                        className='text-green-500 hover:scale-110 text-sm cursor-pointer'
                      />
                      <FontAwesomeIcon onClick={() => handleDelReview(review._id)}
                        className='text-red-500 hover:scale-110 text-sm cursor-pointer' icon={faTrash} />
                    </div>
                  }
                </div>

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