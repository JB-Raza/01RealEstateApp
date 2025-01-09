import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// redux states
import { useSelector, useDispatch } from 'react-redux'
import { updateStart, updateSuccess, updateFailure, clearState } from '../redux/user/userSlice.js'
import { setNotification } from '../redux/notificationSlice.js'

// components
import {Alert, Loader} from '../components/index.js'


function Profile() {

  const currUser = useSelector(state => state.user.currentUser)
  const { loading, error } = useSelector(state => state.user)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [imagePreview, setImagePreview] = useState(currUser.avatar)

  const [formData, setFormData] = useState({
    username: currUser.username,
    email: currUser.email,
    avatar: currUser.avatar,
    oldPassword: '',
    newPassword: '',

  })
  const [userListings, setUserListings] = useState([])

  // get user listings
  useEffect(() => {
    const getUserListings = async () => {
      const res = await fetch(`/api/listings/user/${currUser._id}`)
      const data = await res.json()
      setUserListings(data)
    }
    getUserListings()
  }, [userListings])

  const handleDeleteListing = async (listingId) => {
    const res = await fetch(`api/listings/delete/${listingId}`, { method: "DELETE" })
    const data = await res.json()
    if (data.success) {
      dispatch(setNotification({ type: "success", message: data.message || "Listing deleted successfully" }))
      return
    }
    dispatch(setNotification({ type: "failure", message: data.message || "could not delete Listing" }))

  }

  const handleImgChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()

    try {
      dispatch(updateStart())

      const form = new FormData()
      form.append('avatar', fileRef.current.files[0])
      form.append('username', formData.username)
      form.append('email', formData.email)
      form.append("oldPassword", formData.oldPassword)
      form.append("newPassword", formData.newPassword)


      const res = await fetch(`/api/user/update/${currUser._id}`, {
        method: 'PUT',
        body: form,
      })
      const data = await res.json()

      if (res.ok && data.success) {
        dispatch(setNotification({ type: "success", message: data.message }))
        dispatch(updateSuccess(data.updatedUser))
        navigate('/')
      }
      else {
        dispatch(setNotification({ type: "failure", message: data.message || "could not update user" }))
        dispatch(updateFailure(data.message))
      }
    } catch (error) {
      dispatch(setNotification({ type: "failure", message: error.message || "could not update user" }))
      dispatch(updateFailure(error.message))
    }

  }

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${currUser._id}`, {
        method: 'DELETE',
      })
      // console.log("res == ", res)
      const data = await res.json()
      if (res.ok && data.message) {
        dispatch(setNotification({ type: "success", message: data.message || "user deleted successfully" }))
        dispatch(clearState())
        navigate('/signup')
      }
    } catch (error) {
      dispatch(setNotification({ type: "failure", message: error.message || "Error deleting user" }))
    }
  }
  const handleSignoutUser = async () => {
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
      })
      const data = await res.json()
      if (res.ok && data.message) {
        dispatch(clearState())
        dispatch(setNotification({ type: "success", message: data.message }))
        navigate('/signin')
      }
    } catch (error) {
      dispatch(setNotification({ type: "failure", message: error.message || "error in sign out" }))
    }
  }

  // adding loaders
  if(!currUser){
    return <Loader />
  }
  return (
    <div className='max-w-lg mx-auto px-4 overflow-hidden'>
      <Alert />
      
      <h1 className='main-heading text-center'>Profile</h1>

      <form onSubmit={handleUpdateSubmit}>

        {/* accessing the image file only */}
        <input type="file" hidden
          name='avatar'
          ref={fileRef} accept='image/*'
          onChange={handleImgChange}
        />
        <img src={imagePreview}
          onClick={() => fileRef.current.click()}
          className='mx-auto rounded-full my-4 shadow-md hover:shadow-slate-500 cursor-pointer w-24 sm:w-36 h-24 sm:h-36 object-cover hover:scale-105'
        />

        {/* error handling */}
        {error && <p className='text-red-500 text-center'>{error}</p>}

        {/* username */}
        <input type="text" placeholder='Username' name='username' id='username'
          className='input-box'
          value={formData.username}
          // readOnly
          disabled
        />
        {/* email */}
        <input type="email" placeholder='Email' name='email' id='email'
          value={formData.email}
          className='input-box'
          // readOnly
          disabled
        />
        {/* old Password */}
        <input type="password" placeholder='old Password' name='oldPassword' id='oldPassword'
          value={formData.oldPassword}
          className='input-box'
          onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
        />
        {/* new Password */}
        <input type="password" placeholder='new Password' name='newPassword' id='newPassword'
          value={formData.newPassword}
          className='input-box'
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
        />

        <button type='submit'
          disabled={loading}
          className='main-button'
        >{loading ? "loading..." : "Update"}</button>

        <Link to='/listings/new'>
          <button type='button'
            className='main-button !bg-green-800'
          >Create Listing</button>
        </Link>
      </form>

      {/* delete and signout user */}
      <div className='flex justify-between'>
        <button onClick={handleDeleteUser} className='text-red-700 dark:text-red-500 font-semibold cursor-pointer'>Delete Account</button>
        <button onClick={handleSignoutUser} className='text-indigo-700 dark:text-indigo-500 font-semibold cursor-pointer'>Sign out</button>
      </div>

      {/* all user listings */}
      <div className='my-10'>
        {userListings.length > 0 ? <h1 className='main-heading text-center'>All Listings</h1> : ""}
        {userListings && userListings.map((listing, index) => (
          <div key={index} className='flex gap-3 w-full items-center justify-between my-2 bg-slate-300  dark:bg-slate-700 rounded-md py-1 px-2'>
            <img src={listing.images[0]} alt="img"
              className='w-16 rounded-md hover:scale-105 transition-all duration-75'
            />
            <Link to={`/listings/${listing._id}`}>
              <h2 className='font-semibold text-lg dark:text-slate-200 text-center hover:underline'>{listing.title}</h2>
            </Link>

            {/* actions */}
            <span className="actions flex flex-col">
              <Link to={`/listings/${listing._id}/update`}>
                <button className='text-green-500 dark:hover:text-green-400 font-semibold hover:text-green-600'>Update</button>
              </Link>
              <button className='text-red-600 dark:hover:text-red-500 font-semibold hover:text-red-600' onClick={() => handleDeleteListing(listing._id)} >Delete</button>
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Profile



