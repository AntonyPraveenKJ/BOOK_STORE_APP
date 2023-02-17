import axios from "axios";
import Navbar from "./Navbar";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
axios.defaults.withCredentials = true;
let firstRender = true;

function English() {
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
        <h1>English Books</h1>
      </div>
    </>
  );
}

export default English;
