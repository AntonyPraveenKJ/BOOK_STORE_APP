import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./login";
import cartReducer from "./cart";

export const store=configureStore({
    reducer:{
        login: loginReducer,
        cart:cartReducer,
    }
})