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

function AddSubCatergory() {
  const [categories, setCategories] = useState([]);
  const [inputs, setInputs] = useState({
    category: "",
    subcategory: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!inputs.category) {
      newErrors.category = "Please Select Category";
    }
    if (!inputs.subcategory) {
      newErrors.subcategory = "Please Enter Sub-Category";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendRequest = async () => {
    await axios
      .put("http://localhost:5000/admin/addmoresub", {
        category: inputs.category,
        subcategory: inputs.subcategory,
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //send http request
    if (validateForm()) {
      sendRequest()
        .then(() => alert("Sub-Category added!!"))
        .then(() =>
          setInputs({
            category: "",
            subcategory: "",
          })
        );
    }
  };

  const getCategory = async () => {
    await axios
      .get("http://localhost:5000/admin/getCategory")
      .then((response) => {
        setCategories(response.data.message);
      });
  };

  useEffect(() => {
    getCategory();
  }, []);

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
              Add Sub-Category
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="outlined-select-currency"
                select
                label="Category"
                defaultValue="None"
                name="category"
                value={inputs.category}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categories.map((item) => {
                  return <MenuItem value={item.name}>{item.name}</MenuItem>;
                })}
              </TextField>
              {errors.category && (
                <div className="error">{errors.category}</div>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                name="subcategory"
                label="Sub-Category"
                type="subcategory"
                id="subcategory"
                autoComplete="current-password"
                value={inputs.subcategory}
                onChange={handleChange}
              />
              {errors.subcategory && (
                <div className="error">{errors.subcategory}</div>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{ backgroundColor: "black", color: "white" }}
                sx={{ mt: 3, mb: 2 }}
              >
                Add Sub-Category
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default AddSubCatergory;
