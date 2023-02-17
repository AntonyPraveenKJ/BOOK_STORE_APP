import axios from "axios";
import Navbar from "./Navbar";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
axios.defaults.withCredentials = true;
let firstRender = true;

function UserCart() {
  const [cartProducts, setCartProducts] = useState([]);
  console.log(cartProducts, "++00__");
  const User = useSelector((state) => state.login);
  console.log(User.userIsLoggedIn, "==login++");
  const [user, setUser] = useState();
  console.log(user, "===user data");
  const refreshToken = async () => {
    const res = await axios
      .get("http://localhost:5000/refresh", {
        withCredentials: true,
      })
      .catch((err) => console.log(err));
    const data = await res.data;
    console.log(data, "=== refreshed data");
    return data;
  };

  const sendRequest = async () => {
    const res = await axios
      .get("http://localhost:5000/", {
        withCredentials: true,
      })
      .catch((err) => console.log(err));
    const data = await res.data;
    console.log(data, "=== user data before refreshing");
    return data;
  };

  useEffect(() => {
    getCartProducts(user);
    if (User.userIsLoggedIn) {
      if (firstRender) {
        firstRender = false;
        sendRequest().then((data) => setUser(data.message));
      }
      let interval = setInterval(() => {
        refreshToken().then((data) => setUser(data.message));
      }, 1000 * 29);

      return () => clearInterval(interval);
    }
  }, []);

  const getCartProducts = async (user) => {
    const res = await axios
      .post("http://localhost:5000/getCartProducts", {
        userId: user._id,
      })
      .catch((err) => console.log(err));
    const data = res.data;
    setCartProducts(data);
    return data;
  };

  return (
    <>
      <Navbar name={user && user.name} />

      <div className="container">
        <img
          src="istockphoto-1216379658-170667a.jpg"
          alt="Banner"
          className="image"
        />
        <div className="text">
          We want to help you find the stories you love!
        </div>
        <div className="text2">
          "Our bookstore will fill your bookshelves with tons of new stories to
          read."
        </div>
      </div>

      <div className="heading">
        <h1>Cart</h1>
      </div>

      <div className="cartTable">
        <Paper>
          <TableContainer>
            <Table className="proTable" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Column 2</TableCell>
                  <TableCell>Column 3</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartProducts &&
                  cartProducts.map((item) => {
                    return (
                      <TableRow>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>Row 1, Column 2</TableCell>
                        <TableCell>Row 1, Column 3</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </>
  );
}

export default UserCart;
