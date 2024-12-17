import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice'
import {useNavigate} from 'react-router-dom'

function Profile() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currUser = useSelector(state => state.user.currentUser)
  const {loading} = useSelector(state => state.user)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    username: currUser.username,
    email: currUser.email,
    avatar: currUser.avatar,
    oldPassword: "",
    newPassword: "",
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateStart())
      const result = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      })

      const data = await result.json()
      if (!data.success) {
        dispatch(updateFailure())
        setError(data.message)
        return
      }
      dispatch(updateSuccess(data))
      navigate('/')
    } catch (error) {
      setError(error.message)
      dispatch(updateFailure())
    }
  }

  return (
    <div className='max-w-lg mx-auto px-4'>
      <h1 className='text-center my-5 text-3xl font-bold'>Profile</h1>

      <img src={currUser.avatar} alt=""
        className='mx-auto rounded-full my-4 shadow-lg cursor-pointer w-36 sm:w-52 h-36 sm:h-52 object-cover hover:shadow-xl hover:scale-105'
      />

      <form action='auth/user/update?_method=PUT' method='post'
        onSubmit={handleSubmit}
      >
        <input type="text" placeholder='Username' name='username' id='username'
          className='input-box'
          value={formData.username}
          disabled={true}
        />
        <input type="email" placeholder='Email' name='email' id='email'
          value={formData.email}
          className='input-box'
          disabled={true}
        />
        <input type="password" placeholder='Old Password' name='oldPassword' id='oldPassword'
          className='input-box'
          value={formData.oldPassword}
          onChange={handleInputChange}
        />
        <input type="password" placeholder='New Password' name='newPassword' id='newPassword'
          className='input-box'
          value={formData.newPassword}
          onChange={handleInputChange}
        />
        <button type='submit'
        disabled = {loading}
          className='uppercase my-2 py-3 outline-none font-semibold text-sm sm:text-base bg-slate-800 text-white rounded-md w-full active:scale-95 hover:opacity-90 disabled:opacity-70'
        >{loading?"loading...":"Update"}</button>
        <button type='button'
          className='uppercase py-3 outline-none font-semibold text-sm sm:text-base bg-green-800 text-white rounded-md w-full active:scale-95 hover:opacity-90 disabled:opacity-70'
        >Create Listing</button>
      </form>
      <div className='flex justify-between my-2'>
        <span className='text-red-700 font-semibold cursor-pointer'>Delete Account</span>
        <span className='text-blue-700 font-semibold cursor-pointer'>Sign out</span>
      </div>
      <div className="error">
        {error && <p className=''><span className='text-red-700 font-semibold'>ERROR: </span>{ error }</p>}
      </div>
    </div>
  )
}

export default Profile
