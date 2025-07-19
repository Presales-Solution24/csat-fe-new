import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import MainLayout from "../components/MainLayout";
import { API, API_FORM } from "../services/api";

export default function ProjectSatisfactionUpload() {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [saving, setSaving] = useState(false);

  const handleDownloadTemplate = async () => {
    try {
      const res = await API.get("/project-satisfaction/template/excel", {
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "project_satisfaction_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Gagal mengunduh template",
        severity: "error",
      });
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPreviewData([]);
  };

  const handleUpload = async () => {
    if (!file) {
      setSnackbar({
        open: true,
        message: "Silakan pilih file Excel terlebih dahulu",
        severity: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await API_FORM.post(
        "/project-satisfaction/upload/preview",
        formData
      );

      if (res.data.preview && Array.isArray(res.data.preview)) {
        setPreviewData(res.data.preview);
        setSnackbar({
          open: true,
          message: "Preview data berhasil dimuat",
          severity: "success",
        });
      } else {
        throw new Error("Format preview tidak dikenali");
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message:
          err.response?.data?.error || "Gagal mengunggah dan memproses file",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDatabase = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setSaving(true);
    try {
      const res = await API.post(
        "/project-satisfaction/upload/save",
        previewData, // ini harus berupa array of objects hasil preview
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSnackbar({
        open: true,
        message: res.data?.message || "Data berhasil disimpan ke database",
        severity: "success",
      });
      setPreviewData([]); // Clear table
      setFile(null); // Clear file
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "Gagal menyimpan ke database",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="xl">
        <Typography variant="h4" gutterBottom>
          Upload Project Satisfaction dari Excel
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button variant="outlined" onClick={handleDownloadTemplate}>
            📥 Export Template Excel
          </Button>

          <Button variant="contained" component="label">
            📤 Pilih File Excel
            <input
              type="file"
              accept=".xlsx"
              hidden
              onChange={handleFileChange}
            />
          </Button>

          <Button
            variant="contained"
            color="success"
            disabled={!file || loading}
            onClick={handleUpload}
          >
            {loading ? "Memproses..." : "Upload & Preview"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={saving}
            onClick={handleSaveToDatabase}
          >
            {saving ? "Menyimpan..." : "Simpan ke Database"}
          </Button>
        </Box>

        {file && (
          <Typography sx={{ mb: 2 }}>
            File dipilih: <strong>{file.name}</strong>
          </Typography>
        )}

        {loading && <CircularProgress sx={{ mt: 2 }} />}

        {previewData.length > 0 && (
          <Paper sx={{ mt: 3, p: 2, backgroundColor: "#f9f9f9" }}>
            <Typography variant="h6" gutterBottom>
              Preview Data Upload
            </Typography>

            <Box sx={{ overflowX: "auto" }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>Tanggal Project</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Pribadi</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Project</TableCell>
                    <TableCell>Presales</TableCell>
                    <TableCell>Tipe Produk</TableCell>
                    <TableCell>Kategori Produk</TableCell>
                    <TableCell>Task 1</TableCell>
                    <TableCell>Expected 1</TableCell>
                    <TableCell>Actual 1</TableCell>
                    <TableCell>Task 2</TableCell>
                    <TableCell>Expected 2</TableCell>
                    <TableCell>Actual 2</TableCell>
                    <TableCell>Task 3</TableCell>
                    <TableCell>Expected 3</TableCell>
                    <TableCell>Actual 3</TableCell>
                    <TableCell>Tanggal Approve</TableCell>
                    <TableCell>Approved</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewData.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor:
                          row.status === "invalid" ? "#ffe6e6" : "inherit",
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row["Tanggal Project"]}</TableCell>
                      <TableCell>{row["Nama Company"]}</TableCell>
                      <TableCell>{row["Nama Pribadi"]}</TableCell>
                      <TableCell>{row["Email"]}</TableCell>
                      <TableCell>{row["Judul Project"]}</TableCell>
                      <TableCell>{row["Nama Presales"]}</TableCell>
                      <TableCell>{row["Tipe Produk"]}</TableCell>
                      <TableCell>{row["Kategori Produk"]}</TableCell>
                      <TableCell>{row["Task 1"]}</TableCell>
                      <TableCell>{row["Expected 1"]}</TableCell>
                      <TableCell>{row["Actual 1"]}</TableCell>
                      <TableCell>{row["Task 2"]}</TableCell>
                      <TableCell>{row["Expected 2"]}</TableCell>
                      <TableCell>{row["Actual 2"]}</TableCell>
                      <TableCell>{row["Task 3"]}</TableCell>
                      <TableCell>{row["Expected 3"]}</TableCell>
                      <TableCell>{row["Actual 3"]}</TableCell>
                      <TableCell>{row["Tanggal Approve"]}</TableCell>
                      <TableCell>{row["Approved"]}</TableCell>
                      <TableCell>{row["Rating"]}</TableCell>
                      <TableCell>
                        <strong
                          style={{
                            color: row.status === "invalid" ? "red" : "green",
                          }}
                        >
                          {row.status}
                        </strong>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </MainLayout>
  );
}
