import { createSlice, current } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // User Authentication Reducers
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        // User Update Reducers
        updateStart: (state) => {
            state.loading = true;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload; 
            state.loading = false;
            state.error = null;
        },
        updateFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        // clear state reducer for logout and deleting user
        clearState: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        }
    }
})

export const {
    signInStart, signInSuccess, signInFailure,
    updateStart, updateSuccess, updateFailure,
    clearState,
} = userSlice.actions
export default userSlice.reducer

