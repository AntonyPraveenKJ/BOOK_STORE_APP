import axios from "axios";
import Navbar from "./Navbar";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  Button,
  CardActionArea,
  CardActions,
  Grid,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../Redux/cart";
axios.defaults.withCredentials = true;
let firstRender = true;

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [color, setColor] = useState("black");
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

  const handleWishClick = () => {
    if (color === "black") {
      setColor("red");
    } else {
      setColor("black");
    }
  };

  const getProducts = async () => {
    await axios
      .get("http://localhost:5000/admin/getAllProducts")
      .then((response) => {
        console.log(response.data.products);
        setProducts(response.data.products);
      });
  };

  const handleAddToCart = async (product, user) => {
    if (!User.userIsLoggedIn) {
      navigate("/login");
    } else {
      const res = await axios
        .post("http://localhost:5000/addToCart", {
          proId: product._id,
          userId: user._id,
        })
        .catch((err) => console.log(err))
        .then(() => navigate("/userCart"));
      const data = res.data;
      return data;
    }
  };

  useEffect(() => {
    getProducts();
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
        <h1>Books</h1>
      </div>
      <Grid container spacing={2} p={4}>
        {products.map((item) => {
          return (
            <Grid item key={item._id} xs={12} sm={6} lg={3} md={4}>
              <Card
                sx={{ maxWidth: 250, height: "100%" }}
                key={item._id}
                className="productCard"
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    sx={{ width: "250px", height: "330px" }}
                    image={item.image[0]}
                    alt="proImage"
                  />
                  <CardContent sx={{ textAlign: "center", height: "100%" }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {item.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.author}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{
                      minHeight: "48px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <IconButton
                      key={item._id}
                      sx={{ color: color }}
                      className="addcart"
                      aria-label="add to favorites"
                      onClick={handleWishClick}
                    >
                      <FavoriteIcon />
                    </IconButton>
                    <Button
                      className="addcart"
                      size="small"
                      variant="contained"
                      onClick={() => handleAddToCart(item, user)}
                      style={{ backgroundColor: "black", color: "white" }}
                    >
                      Add To Cart
                    </Button>
                  </CardActions>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}

export default Home;
