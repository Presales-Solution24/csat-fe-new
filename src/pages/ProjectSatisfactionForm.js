import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Paper,
  Button,
  Snackbar,
  Alert,
  Container,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import API from "../services/api"; // axios instance

export default function ProjectSatisfactionForm() {
  const [formData, setFormData] = useState({
    namaCompany: "",
    namaPribadi: "",
    email: "",
    noHp: "",
    jabatan: "",
    projectTitle: "",
    namaPresales: "",
    tanggalProjek: "",
    tanggalApproved: "",
    approved: "",
    rating: "",
    tipeProduk: "",
    kategoriProduk: "",
  });

  const [projectId, setProjectId] = useState(null);
  const [tasks, setTasks] = useState([
    { task: "", expectedResult: "", actualResult: "" },
  ]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
      const {
        namaCompany,
        namaPribadi,
        email,
        noHp,
        jabatan,
        projectTitle,
        namaPresales,
        tanggalProjek,
        tanggalApproved,
        approved,
        rating,
        tipeProduk,
        kategoriProduk,
        tasks,
      } = res.data;

      setFormData({
        namaCompany: namaCompany || "",
        namaPribadi: namaPribadi || "",
        email: email || "",
        noHp: noHp || "",
        jabatan: jabatan || "",
        projectTitle: projectTitle || "",
        namaPresales: namaPresales || "",
        tanggalProjek: tanggalProjek || "",
        tanggalApproved: tanggalApproved || "",
        approved: approved || "",
        rating: rating || "",
        tipeProduk: tipeProduk || "",
        kategoriProduk: kategoriProduk || "",
      });

      if (tasks && tasks.length > 0) {
        setTasks(
          tasks.map((t) => ({
            task: t.task || "",
            expectedResult: t.expectedResult || "",
            actualResult: t.actualResult || "",
          }))
        );
      }
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setSnackbar({
        open: true,
        message: "Gagal mengambil data project",
        severity: "error",
      });
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

  const handleSave = async () => {
    const dataToSave = { ...formData, tasks };
    if (projectId) dataToSave.project_id = projectId;

    try {
      const res = await API.post("/project-satisfaction", dataToSave);
      if (res.data.project_id) {
        const id = res.data.project_id;
        setProjectId(id);
        navigate(`/project-satisfaction?edit=${id}`);
      }
      setSnackbar({
        open: true,
        message: "Data berhasil disimpan",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Gagal menyimpan data",
        severity: "error",
      });
    }
  };

  const renderField = (label, name, type = "text") => (
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label={label}
        name={name}
        type={type}
        onChange={handleChange}
        value={formData[name] || ""}
        variant="outlined"
        margin="normal"
        InputLabelProps={type === "date" ? { shrink: true } : {}}
      />
    </Grid>
  );

  return (
    <MainLayout>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Project Satisfaction Form
        </Typography>

        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 5 }}>
          {/* Project Section */}
          <Typography variant="h6" gutterBottom>
            Project
          </Typography>
          <Grid container spacing={2}>
            {renderField("Project Title", "projectTitle")}
            {renderField("Nama Presales", "namaPresales")}
            {renderField("Tanggal Projek", "tanggalProjek", "date")}
            {renderField("Tanggal Approved", "tanggalApproved", "date")}
            {renderField("Approved (Yes/No)", "approved")}
            {renderField("Score / Rating", "rating")}
            {renderField("Tipe Produk", "tipeProduk")}
            {renderField("Kategori Produk", "kategoriProduk")}
          </Grid>

          {/* Customer Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Customer
          </Typography>
          <Grid container spacing={2}>
            {renderField("Nama Company", "namaCompany")}
            {renderField("Nama Pribadi", "namaPribadi")}
            {renderField("Email", "email")}
            {renderField("Nomor Handphone", "noHp")}
            {renderField("Jabatan / Title", "jabatan")}
          </Grid>

          {/* Task Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Task
          </Typography>
          {tasks.map((t, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: "#f9f9f9" }}>
              <Typography variant="subtitle1" gutterBottom>
                Task {index + 1}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Task"
                    value={t.task || ""}
                    onChange={(e) =>
                      handleTaskChange(index, "task", e.target.value)
                    }
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Expected Result"
                    value={t.expectedResult || ""}
                    onChange={(e) =>
                      handleTaskChange(index, "expectedResult", e.target.value)
                    }
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Actual Result"
                    value={t.actualResult || ""}
                    onChange={(e) =>
                      handleTaskChange(index, "actualResult", e.target.value)
                    }
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          {tasks.length < 3 && (
            <Box sx={{ mb: 2 }}>
              <Button variant="outlined" onClick={addTask}>
                Tambah Task
              </Button>
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Simpan
            </Button>
          </Box>
        </Paper>

        {/* Snackbar Notification */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </MainLayout>
  );
}
