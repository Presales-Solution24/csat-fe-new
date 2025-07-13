import { useEffect, useRef, useState } from "react";
import {
  Typography,
  Paper,
  Container,
  CircularProgress,
  Box,
  Grid,
  Button,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import API from "../services/api";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ProjectReviewPDF() {
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const contentRef = useRef();

  useEffect(() => {
    const projectId = searchParams.get("projectId");
    const download = searchParams.get("download") === "true";

    if (projectId) {
      fetchProject(projectId).then(() => {
        if (download) {
          setTimeout(() => {
            handleDownloadPDF();
          }, 800); // delay untuk memastikan render selesai
        }
      });
    }
  }, []);

  const fetchProject = async (id) => {
    try {
      const res = await API.get(`/project-satisfaction/${id}`);
      setProjectData(res.data);
      return res.data;
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label, value) => (
    <Box sx={{ mb: 1 }}>
      <Typography variant="subtitle2" sx={{ fontSize: "10px", color: "#666" }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontSize: "11px", fontWeight: 500, whiteSpace: "pre-line" }}
      >
        {value || "-"}
      </Typography>
    </Box>
  );

  const handleDownloadPDF = async () => {
    const element = contentRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const ratio = Math.min(
      pageWidth / canvas.width,
      pageHeight / canvas.height
    );
    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;

    const totalPages = Math.ceil(imgHeight / pageHeight);

    for (let i = 0; i < totalPages; i++) {
      const position = -i * pageHeight;
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      pdf.setFontSize(8);
      pdf.text(
        `Page ${i + 1} of ${totalPages}`,
        pageWidth - 25,
        pageHeight - 5
      );
    }

    const now = new Date();
    const formattedDate = now
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .split(".")[0];

    pdf.save(`Project_Satisfaction_${formattedDate}.pdf`);
  };

  if (loading) {
    return (
      <MainLayout>
        <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
        </Container>
      </MainLayout>
    );
  }

  if (!projectData) {
    return (
      <MainLayout>
        <Container maxWidth="md">
          <Typography variant="h6" color="error">
            Data project tidak ditemukan.
          </Typography>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Project Review
          </Typography>
          <Button variant="contained" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </Box>

        <Paper
          ref={contentRef}
          sx={{
            p: 3,
            backgroundColor: "#fff",
            fontSize: "11px",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Project Satisfaction Summary
            </Typography>
          </Box>

          {/* Informasi Project */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Informasi Project
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {renderField("Project Title", projectData.projectTitle)}
              </Grid>
              <Grid item xs={12}>
                {renderField("Nama Presales", projectData.namaPresales)}
              </Grid>
              <Grid item xs={12}>
                {renderField("Tanggal Projek", projectData.tanggalProjek)}
              </Grid>
              <Grid item xs={12}>
                {renderField("Tipe Produk", projectData.tipeProduk)}
              </Grid>
              <Grid item xs={12}>
                {renderField("Kategori Produk", projectData.kategoriProduk)}
              </Grid>
            </Grid>
          </Box>

          {/* Informasi Customer */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Informasi Customer
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {renderField("Nama Company", projectData.namaCompany)}
              </Grid>
              <Grid item xs={12}>
                {renderField("Nama Pribadi", projectData.namaPribadi)}
              </Grid>
              <Grid item xs={12}>
                {renderField("Email", projectData.email)}
              </Grid>
              <Grid item xs={12}>
                {renderField("No. HP", projectData.noHp)}
              </Grid>
              <Grid item xs={12}>
                {renderField("Jabatan", projectData.jabatan)}
              </Grid>
            </Grid>
          </Box>

          {/* Daftar Task */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Daftar Task
            </Typography>
            {(projectData.tasks || []).map((task, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{ p: 2, mb: 1, backgroundColor: "#f9f9f9" }}
              >
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Task {index + 1}
                </Typography>
                {renderField("Task", task.task)}
                {renderField("Expected Result", task.expectedResult)}
                {renderField("Actual Result", task.actualResult)}
              </Paper>
            ))}
          </Box>

          {/* Scoring & Approval */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Scoring & Approval
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {renderField("Tanggal Approved", projectData.tanggalApproved)}
              </Grid>
              <Grid item xs={12}>
                {renderField(
                  "Approved",
                  projectData.approved === "1" || projectData.approved === 1
                    ? "Yes"
                    : "No"
                )}
              </Grid>
              <Grid item xs={12}>
                {renderField("Rating", projectData.rating)}
              </Grid>
            </Grid>
          </Box>

          {/* QR Code at bottom center */}
          <Box
            sx={{
              position: "relative",
              height: "120px",
              mt: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Box textAlign="center">
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 1 }}
              >
                Scan to verify
              </Typography>
              <QRCodeSVG
                value={`Approved by ${projectData.namaPribadi} - ${projectData.namaCompany}`}
                size={90}
              />
            </Box>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
}
