import MainLayout from "../components/MainLayout";
import {
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardActionArea,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SurveyIcon from "@mui/icons-material/Assignment";
import ResultIcon from "@mui/icons-material/BarChart";
import PeopleIcon from "@mui/icons-material/Group";
import API from "../services/api";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const actionCards = [
    {
      title: "Isi Survei",
      description: "Mulai survei kepuasan pelanggan baru",
      icon: <SurveyIcon fontSize="large" color="primary" />,
    },
    {
      title: "Lihat Hasil",
      description: "Lihat statistik & hasil survei",
      icon: <ResultIcon fontSize="large" color="success" />,
    },
    {
      title: "Kelola Pengguna",
      description: "Tambah atau atur pengguna",
      icon: <PeopleIcon fontSize="large" color="warning" />,
    },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/project-satisfaction");
      const projects = res.data;

      const total = projects.length;
      const approved = projects.filter((p) => p.approved === "1").length;
      const notApproved = total - approved;

      // Hanya ambil project yang memiliki rating valid
      const ratedProjects = projects.filter(
        (p) => p.rating !== null && p.rating !== undefined && p.rating !== ""
      );
      const avgRating =
        ratedProjects.length > 0
          ? (
              ratedProjects.reduce((sum, p) => sum + Number(p.rating), 0) /
              ratedProjects.length
            ).toFixed(2)
          : "0.00";

      const byKategori = {};
      projects.forEach((p) => {
        const kategori = p.kategori_produk || "Lainnya";
        byKategori[kategori] = (byKategori[kategori] || 0) + 1;
      });

      const kategoriChartData = Object.keys(byKategori).map((k) => ({
        kategori: k,
        total: byKategori[k],
      }));

      setStats({ total, approved, notApproved, avgRating, kategoriChartData });
    } catch (err) {
      console.error("Gagal memuat data dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Selamat Datang di e-UAT 👋
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6">Total Project</Typography>
                <Typography variant="h4" fontWeight={600}>
                  {stats.total}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6">Approved</Typography>
                <Typography variant="h4" fontWeight={600}>
                  {stats.approved}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6">Not Approved</Typography>
                <Typography variant="h4" fontWeight={600}>
                  {stats.notApproved}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6">Avg. Rating</Typography>
                <Typography variant="h4" fontWeight={600}>
                  {stats.avgRating}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" mb={2}>
              Total Project berdasarkan Kategori Produk
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stats.kategoriChartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="kategori"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </>
      )}

      <Typography variant="h6" mb={2}>
        Aktivitas Cepat
      </Typography>
      <Grid container spacing={3}>
        {actionCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 2,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardActionArea sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  {card.icon}
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.description}
                    </Typography>
                  </Box>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </MainLayout>
  );
}
