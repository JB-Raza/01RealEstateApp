import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { updateStart, updateSuccess, updateFailure, clearState } from '../redux/user/userSlice.js'


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
    console.log("listing data == ", data)
  }
  const handleUpdateListing = async (listingId) => {
    // const res = await fetch("/api/listings")
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
        dispatch(updateSuccess(data.updatedUser))
        navigate('/')
      }
      else dispatch(updateFailure(data.message))
    } catch (error) {
      console.log("ERROR in API == ", error)
      dispatch(updateFailure(error.message))
    }

  }

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${currUser._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      console.log("data == ", data)
      if (res.ok && data.message) {
        console.log("user deleted successfully")
        dispatch(clearState())
        navigate('/signup')
      }
    } catch (error) {
      console.log("error in deleting == ", error.message)
    }
  }
  const handleSignoutUser = async () => {
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
      })
      const data = await res.json()
      if (res.ok && data.message) {
        // console.log("user signed out successfully")
        dispatch(clearState())
        navigate('/signin')
      }
    } catch (error) {
      console.log("error in signing out == ", error.message)
    }
  }

  return (
    <div className='max-w-lg mx-auto px-4'>
      <h1 className='text-center my-5 text-3xl font-bold'>Profile</h1>

      <form onSubmit={handleUpdateSubmit}>

        {/* accessing the image file only */}
        <input type="file" hidden
          name='avatar'
          ref={fileRef} accept='image/*'
          onChange={handleImgChange}
        />

        <img src={imagePreview}
          onClick={() => fileRef.current.click()}
          className='mx-auto rounded-full my-4 shadow-lg cursor-pointer w-24 sm:w-36 h-24 sm:h-36 object-cover hover:shadow-xl hover:scale-105'
        />
        {/* error handing */}
        {/* <div className="error"> */}
        {error && <p className='text-red-500 text-center'>{error}</p>}
        {/* </div> */}

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
          className='uppercase my-2 py-3 outline-none font-semibold text-sm sm:text-base bg-slate-800 text-white rounded-md w-full active:scale-95 hover:opacity-90 disabled:opacity-70'
        >{loading ? "loading..." : "Update"}</button>

        <Link to='/listings/new'>
          <button type='button'
            className='uppercase py-3 outline-none border-0 font-semibold text-sm sm:text-base bg-green-800 text-white rounded-md w-full active:scale-95 hover:opacity-90 disabled:opacity-70'
          >Create Listing</button>
        </Link>
      </form>

      {/* delete and signout user */}
      <div className='flex justify-between my-2'>
        <button onClick={handleDeleteUser} className='text-red-700 font-semibold cursor-pointer'>Delete Account</button>
        <button onClick={handleSignoutUser} className='text-blue-700 font-semibold cursor-pointer'>Sign out</button>
      </div>

      {/* all user listings */}
      <div className='my-10'>
        {userListings.length > 0 ? <h1 className='text-center text-2xl font-bold my-4'>All Listings</h1> : ""}
        {userListings && userListings.map((listing, index) => (
          <div key={index} className='flex gap-3 w-full items-center justify-between my-2 border-4 py-1 px-2'>
              <img src={listing.images[0]} alt="img"
                className='w-16 rounded-md hover:scale-105 transition-all duration-75'
              />
            <Link to={`/listings/${listing._id}`} className=''>
              <h2 className='font-semibold text-lg text-center hover:underline'>{listing.title}</h2>
            </Link>

              {/* actions */}
              <span className="actions flex flex-col">
                <button className='text-green-600 font-semibold hover:text-green-800' onClick={() => handleUpdateListing(listing._id)}>Update</button>
                <button className='text-red-600 font-semibold hover:text-red-800' onClick={() => handleDeleteListing(listing._id)} >Delete</button>
              </span>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Profile



