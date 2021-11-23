import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

const darkInitial = {
    darkMode: false,
    loading:true
}

export const darkSlice = createSlice({
    name: 'darkMode',
    initialState: darkInitial,
    reducers: {
        getMode: (state) => {
            const coockieDark = Cookies.get('dark')
            if (typeof coockieDark === "undefined") {
                return
            }
            state.darkMode = JSON.parse(coockieDark)
            state.loading=false
        },
        darkModeToggle: (state) => {
            state.darkMode = !state.darkMode
            Cookies.set('dark', state.darkMode)
        }
    }
})

const { actions, reducer } = darkSlice;
export const { getMode,darkModeToggle } = actions;
export default reducer;