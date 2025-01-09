import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import OAuth from '../components/OAuth'
// user state and notification state
import { useSelector, useDispatch } from "react-redux"
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import { setNotification } from '../redux/notificationSlice.js'
import Alert from '../components/Alert.jsx'


function SignIn() {
  const [formData, setFormData] = useState({})
  let { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value // use square brackets when we need to get inside another object
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(signInStart())
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(signInFailure(data.message))
        return
      }
      dispatch(setNotification({type: "success", message: "Login successfully"}))
      dispatch(signInSuccess(data))
      navigate("/")

    } catch (error) {
      dispatch(setNotification({type: "success", message: "Login successfully"}))
      dispatch(signInFailure(error.message))
    }

  }


  return (
    <div className='max-w-lg px-6 mx-auto'>
      <Alert />
      <h1 className='main-heading text-center'>Login</h1>

      <form
        action="api/auth/signup" method='post'
        className='flex flex-col'
        onSubmit={handleSubmit}
      >
        
        <input type="email" placeholder='Email' name='email' id='email'
          className='input-box'
          onChange={handleChange}
        />
        <input type="password" placeholder='Password' name='password' id='password'
          className='input-box'
          onChange={handleChange}
        />
        <button type='submit'
          disabled={loading}
          className='main-button'
          
        >{loading ? "loading..." : "login"}</button>
        <OAuth />

      </form>
      <div className='flex gap-2 my-2'>
        <p className='text-slate-800 dark:text-slate-300'>Dont have an account?</p>
        <Link to="/signup" className='text-indigo-700 hover:text-blue-700 font-semibold'>
          <span>Sign-up</span>
        </Link>
      </div>

      {error && <p className='text-red-600 my-2'>{error}</p>}
    </div>

  )
}

export default SignIn 