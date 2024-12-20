import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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


      const res = await fetch('/api/user/update', {
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

  const handleDeleteSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(`/api/user/delete/${currUser._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.message) {
        console.log("user deleted successfully")
        dispatch(clearState())
        navigate('/signup')
      }
    } catch (error) {
      console.log("error in deleting == ", error.message)
    }
  }
  const handleSignoutSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
      })
      const data = await res.json()
      if (res.ok && data.message) {
        console.log("user signed out successfully")
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
          className='mx-auto rounded-full my-4 shadow-lg cursor-pointer w-36 sm:w-52 h-36 sm:h-52 object-cover hover:shadow-xl hover:scale-105'
        />
        {/* error handing */}
        <div className="error">
          {error && <p className='text-red-500 text-center'>{error}</p>}
        </div>

        {/* username */}
        <input type="text" placeholder='Username' name='username' id='username'
          className='input-box'
          value={formData.username}
          readOnly
        />
        {/* email */}
        <input type="email" placeholder='Email' name='email' id='email'
          value={formData.email}
          className='input-box'
          readOnly
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

        <button type='button'
          className='uppercase py-3 outline-none font-semibold text-sm sm:text-base bg-green-800 text-white rounded-md w-full active:scale-95 hover:opacity-90 disabled:opacity-70'
        >Create Listing</button>

      </form>

      <div className='flex justify-between my-2'>
        <form
          onSubmit={handleDeleteSubmit}
        >
          <button className='text-red-700 font-semibold cursor-pointer'>Delete Account</button>

        </form>
        <form onSubmit={handleSignoutSubmit} >
          <button className='text-blue-700 font-semibold cursor-pointer'>Sign out</button>
        </form>
      </div>

    </div>
  )
}

export default Profile



