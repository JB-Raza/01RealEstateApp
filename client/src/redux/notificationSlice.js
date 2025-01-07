import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    type: null, // like success, error or info
    message: null,
}

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotification: (state, action) => {
            state.type = action.payload.type;
            state.message = action.payload.message;
        },
        clearNotification: (state) => {
            state.type = null;
            state.message = null;
        }
    }
})

export const {setNotification, clearNotification} = notificationSlice.actions 
export default notificationSlice.reducer