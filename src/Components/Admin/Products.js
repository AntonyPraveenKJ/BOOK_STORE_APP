import React, { useEffect, useState } from "react";
import Appbar from "./Appbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
  },
});

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    await axios
      .get("http://localhost:5000/admin/getAllProducts")
      .then((response) => {
        console.log(response.data.products);
        setProducts(response.data.products);
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <Appbar />
      <ThemeProvider theme={theme}>
        <Container
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            height: "20vh",
          }}
        >
          <Box m={2}>
            <Button
              onClick={() => navigate("/addProduct")}
              variant="contained"
              color="primary"
            >
              Add Product
            </Button>
          </Box>
        </Container>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Product Name</TableCell>
                <TableCell align="right">Author</TableCell>
                <TableCell align="right">Language</TableCell>
                <TableCell align="right">Binding</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {products.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell sx={{ width: 500 }} component="th" scope="row">
                    <img
                      className="proImg"
                      alt="proImage"
                      src={row.image[0]}
                    ></img>
                  </TableCell>
                  <TableCell align="right">{row.productName}</TableCell>
                  <TableCell align="right">{row.author}</TableCell>
                  <TableCell align="right">{row.language}</TableCell>
                  <TableCell align="right">{row.binding}</TableCell>
                  <TableCell align="right">{row.offerprice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ThemeProvider>
    </>
  );
}

export default Products;
