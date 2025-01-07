import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearNotification } from '../redux/notificationSlice.js'

function Alert() {

    const dispatch = useDispatch();
    const notification = useSelector((state) => state.notification);

    // // clear notification after 5 seconds
    useEffect(() => {
        if(notification.type) {
            const timer = setTimeout(() => {
                dispatch(clearNotification());
            }, 5000);

            // cleanup function
            return () => clearTimeout(timer)
        }    
    }, [notification]);
    

    return !notification.type ? "" : (
        <div>
            <div className={`alert ${notification.type == "success" ? "bg-green-500" : "bg-red-500"} text-white rounded-md max-w-xl min-w-[300px]`} role="alert">
                <div className='flex flex-col gap-2'>
                    <p className='text-xs md:text-sm'>{notification.message}</p>
                </div>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => dispatch(clearNotification())}>X</button>
            </div>
        </div>
    )
}

export default Alert
