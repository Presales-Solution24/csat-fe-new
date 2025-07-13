import MainLayout from "../components/MainLayout";
import {
  Typography,
  Paper,
  Box,
  Grid,
  Card,
//   CardContent,
  CardActionArea,
} from "@mui/material";
import SurveyIcon from "@mui/icons-material/Assignment";
import ResultIcon from "@mui/icons-material/BarChart";
import PeopleIcon from "@mui/icons-material/Group";

export default function Dashboard() {
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

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Selamat Datang di e-UAT 👋
      </Typography>

      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          background: "linear-gradient(90deg, #e3f2fd, #fff)",
          mb: 4,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Apa yang ingin Anda lakukan hari ini?
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, color: "text.secondary" }}>
          Pilih salah satu menu di bawah untuk memulai aktivitas Anda.
        </Typography>
      </Paper>

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
