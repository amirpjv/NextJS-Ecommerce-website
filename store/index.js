import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import darkMode from './darkMode-slice'
import cart from './cart-slice'
import user from './user-slice'
import order from './order-slice'
import admin from './admin-slice'
import product from './product-slice'

const makeStore = () =>
    configureStore({
        reducer: {
            darkMode,
            cart,
            user,
            order,
            admin,
            product
        },
        devTools: true,
    });

export const wrapper = createWrapper(makeStore);