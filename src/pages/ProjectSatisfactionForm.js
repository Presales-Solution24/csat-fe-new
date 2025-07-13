// src/pages/ProjectSatisfactionForm.js
import { useState, useEffect } from "react";
import {
  Box, Typography, Grid, TextField, Paper, Button,
  Snackbar, Alert, Container, IconButton, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import API from "../services/api";

export default function ProjectSatisfactionForm() {
  const [formData, setFormData] = useState({
    namaCompany: "", namaPribadi: "", email: "",
    noHp: "", jabatan: "", projectTitle: "",
    namaPresales: "", tanggalProjek: "",
    tipeProduk: "", kategoriProduk: ""
  });

  const [projectId, setProjectId] = useState(null);
  const [tasks, setTasks] = useState([{ task: "", expectedResult: "", actualResult: "" }]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("edit");
    if (id) {
      setProjectId(id);
      fetchProjectData(id);
    }
  }, []);

  const fetchProjectData = async (id) => {
    try {
      const res = await API.get(`/project-satisfaction/${id}`);
      const data = res.data;

      setFormData({
        namaCompany: data.namaCompany || "", namaPribadi: data.namaPribadi || "",
        email: data.email || "", noHp: data.noHp || "", jabatan: data.jabatan || "",
        projectTitle: data.projectTitle || "", namaPresales: data.namaPresales || "",
        tanggalProjek: data.tanggalProjek || "", tipeProduk: data.tipeProduk || "",
        kategoriProduk: data.kategoriProduk || ""
      });

      if (data.tasks && data.tasks.length > 0) {
        setTasks(data.tasks.map(t => ({
          task: t.task || "", expectedResult: t.expectedResult || "", actualResult: t.actualResult || ""
        })));
      }
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setSnackbar({ open: true, message: "Gagal mengambil data project", severity: "error" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskChange = (index, field, value) => {
    const updated = [...tasks];
    updated[index][field] = value;
    setTasks(updated);
  };

  const addTask = () => {
    if (tasks.length < 3) {
      setTasks([...tasks, { task: "", expectedResult: "", actualResult: "" }]);
    }
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const filteredTasks = tasks.filter((t) => t.task.trim() !== "");
    const dataToSave = { ...formData, tasks: filteredTasks };
    if (projectId) dataToSave.project_id = projectId;

    try {
      const res = await API.post("/project-satisfaction", dataToSave);
      const id = res.data.project_id;
      setProjectId(id);
      setSnackbar({ open: true, message: "Data berhasil disimpan", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Gagal menyimpan data", severity: "error" });
    }
  };

  const renderField = (label, name, type = "text") => (
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth label={label} name={name} type={type}
        onChange={handleChange} value={formData[name] || ""}
        variant="outlined" margin="normal"
        InputLabelProps={type === "date" ? { shrink: true } : {}}
      />
    </Grid>
  );

  return (
    <MainLayout>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>Project Satisfaction Form</Typography>
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 5 }}>
          <Typography variant="h6" gutterBottom>Project</Typography>
          <Grid container spacing={2}>
            {renderField("Project Title", "projectTitle")}
            {renderField("Nama Presales", "namaPresales")}
            {renderField("Tanggal Projek", "tanggalProjek", "date")}
            {renderField("Tipe Produk", "tipeProduk")}
            {renderField("Kategori Produk", "kategoriProduk")}
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Customer</Typography>
          <Grid container spacing={2}>
            {renderField("Nama Company", "namaCompany")}
            {renderField("Nama Pribadi", "namaPribadi")}
            {renderField("Email", "email")}
            {renderField("Nomor Handphone", "noHp")}
            {renderField("Jabatan / Title", "jabatan")}
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Task</Typography>
          {tasks.map((t, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: "#f9f9f9" }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" gutterBottom>Task {index + 1}</Typography>
                <IconButton onClick={() => deleteTask(index)}><DeleteIcon /></IconButton>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Task" value={t.task} onChange={(e) => handleTaskChange(index, "task", e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Expected Result" value={t.expectedResult} onChange={(e) => handleTaskChange(index, "expectedResult", e.target.value)} disabled={!t.task.trim()} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Actual Result" value={t.actualResult} onChange={(e) => handleTaskChange(index, "actualResult", e.target.value)} disabled={!t.task.trim()} />
                </Grid>
              </Grid>
            </Paper>
          ))}
          {tasks.length < 3 && (
            <Box sx={{ mb: 2 }}>
              <Button variant="outlined" onClick={addTask}>Tambah Task</Button>
            </Box>
          )}
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={() => setDialogOpen(true)}>Simpan</Button>
            {projectId && (
              <Button variant="outlined" onClick={() => navigate(`/project-scoring?edit=${projectId}`)}>Lanjut ke Scoring</Button>
            )}
          </Box>
        </Paper>

        {/* Konfirmasi Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Konfirmasi Simpan</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Yakin untuk menyimpan? Periksa kembali data yang diberikan.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={() => { setDialogOpen(false); handleSave(); }} autoFocus>
              Simpan
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar Notification */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </MainLayout>
  );
}
