import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import MainLayout from "../components/MainLayout";

export default function ProductTypeList() {
  const [types, setTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    const res = await API.get("/product-types");
    setTypes(res.data);
  };

  const handleEdit = (id) => {
    navigate(`/product-type-form?edit=${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus tipe produk ini?")) {
      await API.delete(`/product-types/${id}`);
      fetchTypes();
    }
  };

  const handleAdd = () => {
    navigate("/product-type-form");
  };

  return (
    <MainLayout>
      <Container sx={{ mt: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            📦 Tipe Produk
          </Typography>
          <Button variant="contained" onClick={handleAdd}>
            Tambah
          </Button>
        </Box>

        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            overflowX: "auto",
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#f0f4f8" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Tipe Produk</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Kategori Produk</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {types.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.tipe_produk}</TableCell>
                  <TableCell>{row.kategori_produk}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleEdit(row.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(row.id)}
                      >
                        Hapus
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </MainLayout>
  );
}
