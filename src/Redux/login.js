import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    userIsLoggedIn: false,
  };



const loginSlice = createSlice({
    name:"login",
    initialState,
    reducers:{
        userLogin:(state,action)=>{
            if(state.userIsLoggedIn===false){
                state.userIsLoggedIn=true
            }
        },
        userLogout:(state)=>{
            if(state.userIsLoggedIn===true){
                state.userIsLoggedIn=false
            }
        }
    }
});

export const { userLogin,userLogout } = loginSlice.actions;

export default loginSlice.reducer;