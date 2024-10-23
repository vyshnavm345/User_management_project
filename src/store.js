import { configureStore } from "@reduxjs/toolkit";
import userReducer from "features/user";
import editReducer from "features/editUserSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        edit: editReducer
    },
    // devTools: process.env.NODE_ENV !== 'production'
})
