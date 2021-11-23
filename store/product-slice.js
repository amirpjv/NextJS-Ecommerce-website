import { createSlice, current } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

const productInitial = {
    products: [],
    product: {}
}

export const productSlice = createSlice({
    name: 'product',
    initialState: productInitial,
    reducers: {
        getProducts: (state, action) => {
            state.products = action.payload
        },
        getProduct: (state, action) => {
            state.product = action.payload
        },
        createProduct: (state, action) => {
            state.products.push(action.payload.product)
        },
        deleteProduct: (state, action) => {
            const id = action.payload
            const products=current(state.products)
            state.products = products.filter(x => x._id !== id)
        }
    }
})

const { actions, reducer } = productSlice;
export const { getProducts, getProduct, createProduct, deleteProduct } = actions;
export default reducer;
