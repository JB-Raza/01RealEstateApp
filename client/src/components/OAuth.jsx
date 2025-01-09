import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInFailure, signInSuccess } from '../redux/user/userSlice.js'
import {useNavigate} from 'react-router-dom'

function OAuth() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)

      const result = await signInWithPopup(auth, provider)
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL
        })
      })
      const data = await res.json()
      dispatch(signInSuccess(data))
      navigate("/")

    } catch (error) {
      console.log("could not continue with google sire =", error)
    }
  }

  return (
    <button
    type='button'
    onClick={handleGoogleClick}
    className='uppercase py-3 outline-none font-semibold text-sm sm:text-base bg-red-600 text-white rounded-md w-full active:scale-95 hover:opacity-90 disabled:opacity-70'
    >Continue with Google</button>
  )
}

export default OAuth
