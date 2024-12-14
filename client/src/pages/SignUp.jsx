import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"

function SignUp() {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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

    } catch (error) {
      setLoading(false)
      setError(error.message)
    }

  }


  return (
    <div className='max-w-lg px-6 mx-auto'>

      <h1 className='text-center my-6 font-semibold text-3xl'>Sign Up</h1>

      <form
        action="api/auth/signup" method='post'
        className='flex flex-col'
        onSubmit={handleSubmit}
      >
        
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
          className='uppercase my-2 py-3 outline-none font-semibold text-sm sm:text-base bg-slate-800 text-white rounded-md w-full active:scale-95 hover:opacity-80 disabled:opacity-70'
        >{loading ? "loading..." : "sign up"}</button>

        <button type='button' className='my-2 py-3 outline-none font-semibold text-sm sm:text-base bg-red-600 text-white rounded-md w-full active:scale-95 hover:opacity-80 disabled:opacity-70'>CONTINUE WITH GOOGLE</button>
      </form>
      <div className='flex gap-2'>
        <p>Have an account?</p>
        <Link to="/signin" className='text-blue-800 font-semibold'>
          <span>Sign-in</span>
        </Link>
      </div>

      {error && <p className='text-red-600 my-2'>{error}</p>}
    </div>

  )
}

export default SignUp