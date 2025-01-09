import { useState, useRef } from 'react'
import { Link, useNavigate } from "react-router-dom"
import OAuth from '../components/OAuth'


// state
import { useDispatch } from 'react-redux'
import { setNotification } from '../redux/notificationSlice.js'
import Alert from '../components/Alert.jsx'

function SignUp() {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [imagePreview, setImagePreview] = useState(null)

  const handleImgChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value // use square brackets when we need to get inside another object
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const form = new FormData()
      form.append('avatar', fileRef.current.files[0])
      form.append('username', formData.username)
      form.append('email', formData.email)
      form.append('password', formData.password)

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        // headers: { "Content-Type": "application/json"}, // no need for this since we are using FormData as it sets the headers to multipart/form-data
        // body: JSON.stringify(form),  // for sending textual data and not files
        body: form,
      })
      const data = await res.json()
      if (data.success === false) {
        setLoading(false)
        setError(data.message)
        return
      }
      setLoading(false)
      setError(null)
      navigate("/signin")
      dispatch(setNotification({type: "success", message: "Sign up successfully"}))

    } catch (error) {
      setLoading(false)
      setError(error.message)
    }

  }


  return (
    <div className='max-w-[1000px] mx-auto px-4 py-8'>
      <Alert />
      <h1 className='main-heading text-center'>Sign Up</h1>

      <form
        action="api/auth/signup" method='post'
        className='flex flex-col sm:flex-row gap-3 items-center w-full'
        onSubmit={handleSubmit}
      >
        {/* image upload */}
        <div className='m-auto w-1/3 h-1/3'>

          <input type="file" name="avatar" id="avatar" ref={fileRef} hidden
            onChange={handleImgChange}
          />
          <img src={imagePreview || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKaiKiPcLJj7ufrj6M2KaPwyCT4lDSFA5oog&s"}
            className='rounded-full mx-auto my-4 w-36 h-36 sm:w-56 sm:h-56 object-cover shadow-lg cursor-pointer hover:shadow-xl hover:scale-105'
            onClick={() => fileRef.current.click()}
          />
        </div>

        {/* other form info */}
        <div className='w-2/3'>
          <input type="text" placeholder='Username' name='username' id='username'
            className='input-box'
            onChange={handleChange}
          />
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
          >{loading ? "loading..." : "sign up"}</button>
          <OAuth />
          <div className='flex gap-2 my-2'>
            <p className='text-slate-800 dark:text-slate-200'>Have an account?</p>
            <Link to="/signin" className='text-indigo-700 hover:text-blue-700 font-semibold'>
              <span>Sign-in</span>
            </Link>
          </div>
          {error && <p className='text-red-600 my-2'>{error}</p>}
        </div>

      </form>

    </div>

  )
}

export default SignUp
