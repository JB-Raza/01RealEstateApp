import {useSelector} from 'react-redux'
import {Navigate, Outlet} from "react-router-dom"

function PrivateRoute() {
    const currUser = useSelector(state => state.user.currentUser)
  return  currUser? <Outlet /> : <Navigate to="/signin" />
}

export default PrivateRoute
