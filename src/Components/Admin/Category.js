import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import { Grid } from "@mui/material";
import axios from "axios";

const theme = createTheme();

function Category() {
  const navigate = useNavigate();

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
      newErrors.category = "Please Enter Category";
    }
    if (!inputs.subcategory) {
      newErrors.subcategory = "Please Enter Sub-Category";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendRequest = async () => {
    const res = await axios
      .post("http://localhost:5000/admin/addNewCategory", {
        category: inputs.category,
        subcategory: inputs.subcategory,
      })
      .catch((err) => console.log(err));
    const data = await res.data;
    return data;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //send http request
    if (validateForm()) {
      sendRequest()
        .then(() => alert("Category Added Successfully!!"))
        .then(() => {
          setInputs({
            category: "",
            subcategory: "",
          });
        });
    }
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
              Add Category
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
                id="category"
                label="Category"
                name="category"
                autoComplete="category"
                value={inputs.category}
                onChange={handleChange}
                autoFocus
              />
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
                value={inputs.subcategory}
                onChange={handleChange}
                autoComplete="current-password"
              />
              {errors.subcategory && (
                <div className="error">{errors.subcategory}</div>
              )}
              <Grid container>
                <Grid item>
                  <Link
                    sx={{ cursor: "pointer" }}
                    style={{ color: "black" }}
                    variant="body2"
                    onClick={() => navigate("/addSubCategory")}
                  >
                    {"Add More +"}
                  </Link>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{ backgroundColor: "black", color: "white" }}
                sx={{ mt: 3, mb: 2 }}
              >
                Add Category
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default Category;
