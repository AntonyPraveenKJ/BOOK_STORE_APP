import {createSlice} from "@reduxjs/toolkit";

const INITIAL_STATE={
    cartList:[],
};

const cartSlice=createSlice({
    name:"cart",
    initialState:INITIAL_STATE,
    reducers:{
        addToCart:(state,action)=>{
           console.log(action)
        }
    }
});

export const{addToCart}=cartSlice.actions;

export default cartSlice.reducer;
