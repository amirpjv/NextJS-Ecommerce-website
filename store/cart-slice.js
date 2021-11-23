import { createSlice, current } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

const cartInitial = {
    cartItems: [],
    totalQuantity: 0,
    totalPrice: 0
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState: cartInitial,
    reducers: {
        getCartItems: (state) => {
            const coockieCart = Cookies.get('cart')
            const coockieTotalQuantity = Cookies.get('totalQuantity')
            const coockieTotalPrice = Cookies.get('totalPrice')
            if (typeof coockieCart === "undefined") {
                return
            }
            state.cartItems = JSON.parse(coockieCart)
            state.totalQuantity = JSON.parse(coockieTotalQuantity)
            state.totalPrice = JSON.parse(coockieTotalPrice)
        },
        addCartItem: (state, action) => {
            const newItem = action.payload.data
            const existItem = state.cartItems.find(item => item._id === newItem._id)
            if (!existItem) {
                state.totalQuantity = state.totalQuantity + 1
                state.totalPrice = state.totalPrice + newItem.price
                state.cartItems.push({
                    ...newItem, quantity: 1
                })
            } else {
                state.totalQuantity = state.totalQuantity + 1
                state.totalPrice = state.totalPrice + newItem.price
                existItem.quantity++
            }
            // state.cartItems = existItem
            //     ?
            //     state.cartItems.map((item) =>
            //         item.name === existItem.name ? newItem : item
            //     )
            //     :
            //     [...state.cartItems, newItem]
            Cookies.set('cart', JSON.stringify(state.cartItems))
            Cookies.set('totalQuantity', JSON.stringify(state.totalQuantity))
            Cookies.set('totalPrice', JSON.stringify(state.totalPrice))
        },
        removeCartItem: (state, action) => {
            const id = action.payload
            const existItem = state.cartItems.find(item => item._id === id)
            state.totalQuantity = state.totalQuantity - existItem.quantity
            state.totalPrice = state.totalPrice - (existItem.quantity * existItem.price)
            state.cartItems = state.cartItems.filter(item => item._id !== id)
            Cookies.set('cart', JSON.stringify(state.cartItems))
            Cookies.set('totalQuantity', JSON.stringify(state.totalQuantity))
            Cookies.set('totalPrice', JSON.stringify(state.totalPrice))
        },
        decreaseCartItem: (state, action) => {
            const id = action.payload
            const existItem = state.cartItems.find(item => item._id === id)
            if (existItem.quantity === 1) {
                state.cartItems = state.cartItems.filter(item => item._id !== id)
                Cookies.set('cart', JSON.stringify(state.cartItems))
                state.totalQuantity--
                state.totalPrice = state.totalPrice - existItem.price
                Cookies.set('totalQuantity', JSON.stringify(state.totalQuantity))
                Cookies.set('totalPrice', JSON.stringify(state.totalPrice))
            } else {
                existItem.quantity--
                state.totalPrice = state.totalPrice - existItem.price
                Cookies.set('cart', JSON.stringify(state.cartItems))
                state.totalQuantity--
                Cookies.set('totalQuantity', JSON.stringify(state.totalQuantity))
                Cookies.set('totalPrice', JSON.stringify(state.totalPrice))
            }
        },
        increaseCartItem: (state, action) => {
            const id = action.payload
            const existItem = state.cartItems.find(item => item._id === id)
            if (typeof existItem === "undefined") {
                return
            } else {
                state.totalQuantity++
                existItem.quantity++
                state.totalPrice = state.totalPrice + existItem.price
                Cookies.set('cart', JSON.stringify(state.cartItems))
                Cookies.set('totalQuantity', JSON.stringify(state.totalQuantity))
                Cookies.set('totalPrice', JSON.stringify(state.totalPrice))
            }
        },
        removeCartItems: (state) => {
            state.cartItems = []
            Cookies.remove('cart')
            state.totalQuantity = 0
            Cookies.remove('totalQuantity')
            state.totalPrice = 0
            Cookies.remove('totalPrice')
        }
    }
})

const { actions, reducer } = cartSlice;
export const { addCartItem, getCartItems, decreaseCartItem, increaseCartItem, removeCartItem, removeCartItems } = actions;
export default reducer;
