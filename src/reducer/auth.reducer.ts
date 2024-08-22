import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../pages/auth/auth.service";

export const getLoggedInUserFromReducer:any = createAsyncThunk('user/getLoggedInUserFromReducer',
    async () => {
        try {
            const response: any = await authService.getRequest('/auth/me', { auth: true })
            return response.result
        } catch (exception) {
            throw (exception)
        }
    }
)

const UserSlicer = createSlice({
    name: 'User',
    initialState: {
        loggedInUser: null
    },
    reducers: {
        setLoggedInUser: (state, action) => {
            state.loggedInUser = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getLoggedInUserFromReducer.fulfilled, (state, action) => {
            state.loggedInUser = action.payload
        })
        builder.addCase(getLoggedInUserFromReducer.rejected, (state) => {
            state.loggedInUser = null
        })
    }
})

export const { setLoggedInUser } = UserSlicer.actions
export default UserSlicer.reducer;