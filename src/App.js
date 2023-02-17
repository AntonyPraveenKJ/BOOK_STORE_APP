import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/User/Home';
import Login from './Components/User/Login';
import Signup from './Components/User/Signup';
import Dashboard from './Components/Admin/Dashboard';
import Products from './Components/Admin/Products';
import Category from './Components/Admin/Category';
import AddProduct from './Components/Admin/AddProduct';
import AddSubCatergory from './Components/Admin/AddSubCatergory';
import English from './Components/User/English';
import NewArrivals from './Components/User/NewArrivals';
import HardBinded from './Components/User/HardBinded';
import UserCart from './Components/User/UserCart';

function App() {
  
  
  return (
    <React.Fragment>
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/category' element={<Category/>}/>
        <Route path='/addProduct' element={<AddProduct/>}/>
        <Route path='/addSubCategory' element={<AddSubCatergory/>}/>
        <Route path='/englishbooks' element={<English/>}/>
        <Route path='/newarrivals' element={<NewArrivals/>}/>
        <Route path='/hardbinded' element={<HardBinded/>}/>
        <Route path='/userCart' element={<UserCart/>}/>
      </Routes>
   </React.Fragment>
  );
}

export default App;
