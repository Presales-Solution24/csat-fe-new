import {
  Container,
  Typography,
  TextField,
  Grid,
  Paper,
  Button,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Rating,
  FormHelperText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";

export default function PublicScoringForm() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [formData, setFormData] = useState({
    tanggal_approved: "",
    approved: 0,
    rating: 0,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    const t = searchParams.get("token");
    if (t) {
      setToken(t);
      fetchProjectByToken(t);
    }
  }, []);

  const fetchProjectByToken = async (token) => {
    try {
      const res = await API.get(`/public-scoring/${token}`);
      setProjectData(res.data);
      setFormData((prev) => ({
        ...prev,
        tanggal_approved: res.data.tanggal_approved || "",
        approved: res.data.approved ?? 0,
        rating: parseInt(res.data.rating) || 0,
      }));
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Token tidak valid atau project tidak ditemukan.",
        severity: "error",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "approved" ? parseInt(value) : value,
    }));
  };

  const handleRatingChange = (_, newValue) => {
    setFormData((prev) => ({ ...prev, rating: newValue }));
  };

  const handleSubmit = async () => {
    try {
      await API.post(`/public-scoring/${token}`, formData);
      setSnackbar({
        open: true,
        message: "Scoring berhasil disimpan.",
        severity: "success",
      });
      setConfirmDialogOpen(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Gagal menyimpan scoring.",
        severity: "error",
      });
    }
  };

  const renderReadOnlyField = (label, value) => (
    <Grid item xs={12} sm={6}>
      <TextField
        label={label}
        value={value || "-"}
        fullWidth
        margin="normal"
        InputProps={{ readOnly: true }}
        variant="filled"
      />
    </Grid>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Project Scoring Form
        </Typography>

        {projectData && (
          <>
            {/* Informasi Project */}
            <Typography variant="h6" sx={{ mt: 3 }}>Informasi Project</Typography>
            <Grid container spacing={2}>
              {renderReadOnlyField("Project Title", projectData.project_title)}
              {renderReadOnlyField("Nama Presales", projectData.nama_presales)}
              {renderReadOnlyField("Tanggal Projek", projectData.tanggal_projek)}
              {renderReadOnlyField("Tipe Produk", projectData.tipe_produk)}
              {renderReadOnlyField("Kategori Produk", projectData.kategori_produk)}
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Informasi Customer */}
            <Typography variant="h6">Informasi Customer</Typography>
            <Grid container spacing={2}>
              {renderReadOnlyField("Nama Company", projectData.nama_company)}
              {renderReadOnlyField("Nama Pribadi", projectData.nama_pribadi)}
              {renderReadOnlyField("Email", projectData.email)}
              {renderReadOnlyField("No. HP", projectData.no_hp)}
              {renderReadOnlyField("Jabatan", projectData.jabatan)}
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Informasi Task */}
            <Typography variant="h6">Informasi Task</Typography>
            {(projectData.tasks || []).map((task, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{ p: 2, mb: 2, backgroundColor: "#f8f8f8" }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Task {index + 1}
                </Typography>
                <Grid container spacing={2}>
                  {renderReadOnlyField("Task", task.task)}
                  {renderReadOnlyField("Expected Result", task.expected_result)}
                  {renderReadOnlyField("Actual Result", task.actual_result)}
                </Grid>
              </Paper>
            ))}

            <Divider sx={{ my: 3 }} />

            {/* Input Scoring */}
            <Typography variant="h6">Input Scoring</Typography>
            <Grid container marginY={2} spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tanggal Approved"
                  type="date"
                  name="tanggal_approved"
                  InputLabelProps={{ shrink: true }}
                  value={formData.tanggal_approved}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="approved-label">Approved</InputLabel>
                  <Select
                    labelId="approved-label"
                    name="approved"
                    value={formData.approved}
                    label="Approved"
                    onChange={handleChange}
                  >
                    <MenuItem value={1}>Approved</MenuItem>
                    <MenuItem value={0}>Not Approved</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography component="legend">Rating (1-5)</Typography>
                <Rating
                  name="rating"
                  value={formData.rating}
                  onChange={handleRatingChange}
                  disabled={formData.approved !== 1}
                />
                {formData.approved !== 1 && (
                  <FormHelperText>
                    Rating hanya dapat diisi jika project disetujui.
                  </FormHelperText>
                )}
              </Grid>
            </Grid>

            <Button
              variant="contained"
              sx={{ mt: 3 }}
              fullWidth
              onClick={() => setConfirmDialogOpen(true)}
            >
              Simpan Scoring
            </Button>
          </>
        )}
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Dialog Konfirmasi */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Konfirmasi</DialogTitle>
        <DialogContent>
          Apakah Anda yakin ingin menyimpan scoring ini?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Batal</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
