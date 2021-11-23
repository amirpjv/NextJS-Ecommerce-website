import { createSlice ,current} from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

const userInitial = {
    userInfo: Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : '',
    shippingAddress: Cookies.get('shippingAddress') ? JSON.parse(Cookies.get('shippingAddress')) : '',
    paymentMethod: Cookies.get('paymentMethod') ? JSON.parse(Cookies.get('paymentMethod')) : '',
    users: [],
    user: {}
}

export const userSlice = createSlice({
    name: 'user',
    initialState: userInitial,
    reducers: {
        getUser: (state) => {
            const coockieUser = Cookies.get('userInfo')
            if (typeof coockieUser === "undefined") {
                return
            }
            state.userInfo = JSON.parse(coockieUser)
        },
        getAdminUser: (state, action) => {
            state.user = action.payload
        },
        deleteUser: (state, action) => {
            const id = action.payload
            const user = current(state.users)
            state.users = user.filter(x => x._id !== id)
        },
        getUsers: (state, action) => {
            state.users = action.payload
        },
        userLogin: (state, action) => {
            state.userInfo = action.payload.data
            Cookies.set('userInfo', JSON.stringify(state.userInfo))
        },
        userLogout: (state) => {
            state.userInfo = ''
            Cookies.remove('userInfo')
        },
        userShippingAddress: (state, action) => {
            state.shippingAddress = action.payload
            Cookies.set('shippingAddress', JSON.stringify(state.shippingAddress))
        },
        getUserShippingAddress: (state) => {
            const coockieUserShippingAddress = Cookies.get('shippingAddress')
            if (typeof coockieUserShippingAddress === "undefined") {
                return
            }
            state.shippingAddress = JSON.parse(coockieUserShippingAddress)
        },
        userPaymentMethod: (state, action) => {
            state.paymentMethod = action.payload
            Cookies.set('paymentMethod', JSON.stringify(state.paymentMethod))
        },
        getUserPaymentMethod: (state) => {
            const coockieUserPaymentMethod = Cookies.get('paymentMethod')
            if (typeof coockieUserPaymentMethod === "undefined") {
                return
            }
            state.paymentMethod = JSON.parse(coockieUserPaymentMethod)
        }
    }
})

const { actions, reducer } = userSlice;
export const { getUser, getUsers,getAdminUser, deleteUser, userLogin, userLogout, userShippingAddress, getUserShippingAddress, userPaymentMethod, getUserPaymentMethod } = actions;
export default reducer;