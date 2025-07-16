import { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Container,
  Snackbar,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import MainLayout from "../components/MainLayout";
import API from "../services/api";
// ... (semua import sebelumnya tetap)
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { QRCodeSVG } from "qrcode.react";

export default function ProjectScoringForm() {
  const [projectId, setProjectId] = useState(null);
  const [formData, setFormData] = useState({});
  const [scoringToken, setScoringToken] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showViewPdfButton, setShowViewPdfButton] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const id = searchParams.get("edit");
    if (id) {
      setProjectId(id);
      fetchProject(id);
    }
  }, []);

  const fetchProject = async (id) => {
    try {
      const res = await API.get(`/project-satisfaction/${id}`);
      const data = res.data || {};
      setFormData({
        ...data,
        approved: data.approved ?? 0,
      });
      setScoringToken(data.scoring_token); // ← Tambahkan ini
      if (data.approved === 1 && data.rating) {
        setShowViewPdfButton(true);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Gagal mengambil data",
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

  const handleSave = async () => {
    setLoading(true);
    try {
      await API.post("/project-satisfaction", {
        ...formData,
        project_id: projectId,
      });
      await fetchProject(projectId);
      setSnackbar({
        open: true,
        message: "Scoring berhasil disimpan",
        severity: "success",
      });
      if (formData.approved === 1 && formData.rating) {
        setShowViewPdfButton(true);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Gagal menyimpan",
        severity: "error",
      });
    } finally {
      setLoading(false);
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

  const publicLink = scoringToken
    ? `${window.location.origin}/public-scoring-form?token=${scoringToken}`
    : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink);
    setSnackbar({
      open: true,
      message: "Link berhasil disalin!",
      severity: "success",
    });
  };

  return (
    <MainLayout>
      <Container maxWidth="md">
        <Typography variant="h5" gutterBottom>
          Scoring
        </Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/project-satisfaction?edit=${projectId}`)}
          sx={{ mb: 2 }}
        >
          Kembali ke Formulir Project
        </Button>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Informasi Project
          </Typography>
          <Grid container spacing={2}>
            {renderReadOnlyField("Project Title", formData.projectTitle)}
            {renderReadOnlyField("Nama Presales", formData.namaPresales)}
            {renderReadOnlyField("Tanggal Projek", formData.tanggalProjek)}
            {renderReadOnlyField("Tipe Produk", formData.tipeProduk)}
            {renderReadOnlyField("Kategori Produk", formData.kategoriProduk)}
          </Grid>

          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Informasi Customer
          </Typography>
          <Grid container spacing={2}>
            {renderReadOnlyField("Nama Company", formData.namaCompany)}
            {renderReadOnlyField("Nama Pribadi", formData.namaPribadi)}
            {renderReadOnlyField("Email", formData.email)}
            {renderReadOnlyField("No. HP", formData.noHp)}
            {renderReadOnlyField("Jabatan", formData.jabatan)}
          </Grid>

          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Task
          </Typography>
          {(formData.tasks || []).map((task, index) => (
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
                {renderReadOnlyField("Expected Result", task.expectedResult)}
                {renderReadOnlyField("Actual Result", task.actualResult)}
              </Grid>
            </Paper>
          ))}
        </Paper>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Input Scoring
          </Typography>
          <Grid container spacing={2} marginY={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tanggal Approved"
                name="tanggalApproved"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.tanggalApproved || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="approved-label">Approved</InputLabel>
                <Select
                  labelId="approved-label"
                  name="approved"
                  value={formData.approved ?? 0}
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
                value={parseInt(formData.rating) || 0}
                onChange={handleRatingChange}
                disabled={formData.approved !== 1}
              />
              {formData.approved !== 1 && (
                <FormHelperText>
                  Rating hanya bisa diberikan jika project telah disetujui
                </FormHelperText>
              )}
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={() => setConfirmDialogOpen(true)}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<PictureAsPdfIcon />}
                onClick={() =>
                  navigate(`/project-review-pdf?projectId=${projectId}`)
                }
              >
                View PDF
              </Button>
            </Grid>
            {scoringToken && (
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => setShowQR(!showQR)}
                  color="info"
                >
                  {showQR ? "Sembunyikan QR" : "Generate QR Link"}
                </Button>
              </Grid>
            )}
          </Grid>

          {showQR && scoringToken && (
            <Paper sx={{ mt: 3, p: 2, textAlign: "center" }}>
              <QRCodeSVG value={publicLink} size={180} />
              <Typography
                variant="body2"
                sx={{ mt: 2, wordBreak: "break-word" }}
              >
                {publicLink}
              </Typography>
              <Button
                startIcon={<ContentCopyIcon />}
                variant="text"
                onClick={handleCopyLink}
                sx={{ mt: 1 }}
              >
                Salin Link
              </Button>
            </Paper>
          )}
        </Paper>

        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <DialogTitle>Konfirmasi Simpan</DialogTitle>
          <DialogContent>
            Apakah Anda yakin ingin menyimpan data Scoring ini?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialogOpen(false)}>Batal</Button>
            <Button
              variant="contained"
              onClick={async () => {
                setConfirmDialogOpen(false);
                await handleSave();
              }}
            >
              Simpan
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Container>
    </MainLayout>
  );
}
