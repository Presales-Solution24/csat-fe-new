import {
  Container,
  TextField,
  Typography,
  Paper,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";
import MainLayout from "../components/MainLayout";

const kategoriOptions = [
  "Laser Printer",
  "BIJ/LIJ/RIPS",
  "PROJECTOR",
  "Label Printer",
  "SIDM",
  "SCANNER",
  "SD",
  "INKJET",
  "C&I",
  "TSERIES",
  "SurePress",
  "GAGA - MU",
];

export default function ProductTypeForm() {
  const [formData, setFormData] = useState({
    tipe_produk: "",
    kategori_produk: "",
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get("edit");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createdId, setCreatedId] = useState(null);

  useEffect(() => {
    if (editId) fetchDetail(editId);
  }, [editId]);

  const fetchDetail = async (id) => {
    try {
      const res = await API.get(`/product-types/${id}`);
      setFormData(res.data);
    } catch (error) {
      console.error("Gagal mengambil detail tipe produk:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.tipe_produk || !formData.kategori_produk) {
      alert("Mohon lengkapi semua field sebelum menyimpan.");
      return;
    }

    try {
      if (editId) {
        await API.put(`/product-types/${editId}`, formData);
        setCreatedId(editId);
      } else {
        const res = await API.post("/product-types", formData);
        setCreatedId(res.data.id);
      }
      setDialogOpen(true);
    } catch (error) {
      console.error("Gagal menyimpan tipe produk:", error);
      alert("Terjadi kesalahan saat menyimpan.");
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    if (createdId) {
      navigate(`/product-type-form?edit=${createdId}`);
    } else {
      navigate("/product-type-list");
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {editId ? "✏️ Edit Tipe Produk" : "➕ Tambah Tipe Produk"}
          </Typography>

          <TextField
            name="tipe_produk"
            label="Tipe Produk"
            fullWidth
            margin="normal"
            value={formData.tipe_produk}
            onChange={handleChange}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="kategori-produk-label">Kategori Produk</InputLabel>
            <Select
              labelId="kategori-produk-label"
              name="kategori_produk"
              value={formData.kategori_produk}
              onChange={handleChange}
              label="Kategori Produk"
            >
              {kategoriOptions.map((kategori) => (
                <MenuItem key={kategori} value={kategori}>
                  {kategori}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!formData.tipe_produk || !formData.kategori_produk}
            >
              Simpan
            </Button>
          </Box>
        </Paper>

        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Sukses</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Data tipe produk berhasil disimpan.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} variant="contained" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
}
