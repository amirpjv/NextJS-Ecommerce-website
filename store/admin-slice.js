import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

const adminInitial = {
    adminSummery: {}
}

export const adminSlice = createSlice({
    name: 'admin',
    initialState: adminInitial,
    reducers: {
        getSummery: (state, action) => {
            state.adminSummery = action.payload
        },
    }
})

const { actions, reducer } = adminSlice;
export const { getSummery, resetOptions, getOrderHistory } = actions;
export default reducer;
