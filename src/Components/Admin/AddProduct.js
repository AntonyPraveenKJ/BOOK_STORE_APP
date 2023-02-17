import React, { useEffect, useState } from "react";
import Appbar from "./Appbar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MenuItem } from "@mui/material";
import axios from "axios";

const theme = createTheme();

const Languages = [
  { name: "English" },
  { name: "Malayalam" },
  { name: "German" },
  { name: "Others" },
];

const Binding = [{ name: "Paper" }, { name: "Hard" }, { name: "Others" }];

function AddProduct() {
  const [image, setImage] = useState([]);
  const [proName, setProName] = useState("");
  const [sub, setSub] = useState([]);
  const [price, setPrice] = useState();
  const [offer, setOffer] = useState();
  const [categories, setCategories] = useState([]);
  const [author, setAuthor] = useState("");
  const [language, setLanguage] = useState("");
  const [binding, setBinding] = useState("");

  const [category, setCategory] = useState("");
  const [subcategory, setSubCategory] = useState("");
  const [errors, setErrors] = useState({});

  const getCategory = async () => {
    await axios
      .get("http://localhost:5000/admin/getCategory")
      .then((response) => {
        setCategories(response.data.message);
      });
  };

  const handleSub = async (input) => {
    setCategory(input);
    await axios
      .post("http://localhost:5000/admin/getSub", { category: input })
      .then((response) => {
        setSub(response.data.message[0].subCategories);
      });
  };

  useEffect(() => {
    getCategory();
  }, []);

  const validateForm = () => {
    let newErrors = {};
    if (!proName) {
      newErrors.proName = "Please Enter Product Name";
    }
    if (!author) {
      newErrors.author = "Please Enter Author Name";
    }
    if (!price) {
      newErrors.price = "Please Enter Price";
    }
    if (!category) {
      newErrors.category = "Please Select Category";
    }
    if (!subcategory) {
      newErrors.subcategory = "Please Select Sub-Category";
    }
    if (!language) {
      newErrors.language = "Please select Language";
    }
    if (!binding) {
      newErrors.binding = "Please select Binding";
    }
    if (!image) {
      newErrors.image = "Please select Image";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendRequest = async () => {
    const formData = new FormData();
    formData.append("proName", proName);
    formData.append("author", author);
    formData.append("price", price);
    formData.append("offer", offer);
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("language", language);
    formData.append("binding", binding);
    formData.append("image", image);

    const res = await axios
      .post("http://localhost:5000/admin/addNewProduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((err) => console.log(err));
    return res.data;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //send http request
    if (validateForm()) {
      sendRequest()
        .then(() => alert("Product added Successfully!!"))
        .then(() => {
          setProName("");
          setAuthor("");
          setPrice("");
          setOffer("");
          setCategory("");
          setSubCategory("");
          setLanguage("");
          setBinding("");
          setImage("");
        });
    }
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  return (
    <>
      <Appbar />
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "black" }}>
              <ShoppingCartOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Add Product
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <div className="side-by-side">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="proName"
                  label="Book Name"
                  name="proName"
                  autoComplete="proName"
                  value={proName}
                  onChange={(e) => setProName(e.target.value)}
                  autoFocus
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="author"
                  label="Author"
                  name="author"
                  autoComplete="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  autoFocus
                />
              </div>
              {errors.proName && <div className="error">{errors.proName}</div>}
              {errors.author && <div className="error">{errors.author}</div>}
              <div className="side-by-side">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="price"
                  label="Price"
                  type="price"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  autoComplete="current-password"
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="offer"
                  label="Offer"
                  type="offer"
                  id="offer"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              {errors.price && <div className="error">{errors.price}</div>}
              <div className="side-by-side">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="category"
                  select
                  label="Select Category"
                  name="category"
                  value={category}
                  onChange={(e) => {
                    handleSub(e.target.value);
                  }}
                  defaultValue="None"
                >
                  {categories.map((item) => {
                    return (
                      <MenuItem key={item.name} value={item.name}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="subcategory"
                  select
                  label="Select Sub-Category"
                  name="subcategory"
                  value={subcategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  defaultValue="None"
                >
                  {sub.map((item) => {
                    console.log(item);
                    return (
                      <MenuItem key={item.name} value={item.name}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </div>
              {errors.category && (
                <div className="error">{errors.category}</div>
              )}
              {errors.subcategory && (
                <div className="error">{errors.subcategory}</div>
              )}
              <div className="side-by-side">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="language"
                  select
                  label="Select Language"
                  name="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  defaultValue="None"
                >
                  {Languages.map((item) => {
                    return (
                      <MenuItem key={item.name} value={item.name}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </TextField>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="binding"
                  select
                  label="Select Binding"
                  name="binding"
                  value={binding}
                  onChange={(e) => setBinding(e.target.value)}
                >
                  {Binding.map((item) => {
                    return (
                      <MenuItem key={item.name} value={item.name}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </div>
              {errors.language && (
                <div className="error">{errors.language}</div>
              )}
              {errors.binding && <div className="error">{errors.binding}</div>}
              <TextField
                margin="normal"
                required
                fullWidth
                id="image"
                type="file"
                name="image"
                onChange={handleImageChange}
              />
              {errors.image && <div className="error">{errors.image}</div>}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{ backgroundColor: "black", color: "white" }}
                sx={{ mt: 3, mb: 2 }}
              >
                Add Product
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default AddProduct;
