import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

const orderInitial = {
    order: {},
    orderHistory: [],
    successPay:false
}

export const orderSlice = createSlice({
    name: 'order',
    initialState: orderInitial,
    reducers: {
        getOrder: (state, action) => {
            state.order = action.payload
        },
        getOrderHistory: (state, action) => {
            state.orderHistory = action.payload
        },
        deliverRequest: (state, action) => {
            
        },
        deliveredSuccess: (state, action) => {
            state.order.isDelivered = true
        },
        paySuccess: (state, action) => {
            state.order.isPaid = true
            state.successPay = true
        },
        payFail: (state, action) => {
            state.order.isPaid = false
        },
        payReset: (state, action) => {
            state.successPay = false
        },
    }
})

const { actions, reducer } = orderSlice;
export const { getOrder, getOrderHistory, deliverRequest,deliveredSuccess, paySuccess,payFail,payReset } = actions;
export default reducer;
