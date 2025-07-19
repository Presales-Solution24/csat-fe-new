import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Logo from "../assets/euat_logo.png"; // Pastikan kamu punya file logo

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async () => {
    const { username, email, password, confirmPassword } = form;

    if (!username || !email || !password || !confirmPassword) {
      return setError("Semua field wajib diisi.");
    }
    if (password.length < 6) {
      return setError("Password minimal 6 karakter.");
    }
    if (password !== confirmPassword) {
      return setError("Konfirmasi password tidak cocok.");
    }

    try {
      await API.post("/register", { username, email, password });
      setSuccessDialogOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || "Register gagal.");
    }
  };

  const handleDialogClose = () => {
    setSuccessDialogOpen(false);
    navigate("/dashboard");
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
        <Box textAlign="center" mb={2}>
          <img
            src={Logo}
            alt="Logo Aplikasi"
            width={64}
            height={64}
            style={{ marginBottom: 8 }}
          />
          <Typography variant="h5" fontWeight={600}>
            Daftar Akun
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Username"
          name="username"
          margin="normal"
          value={form.username}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          margin="normal"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          margin="normal"
          value={form.password}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Konfirmasi Password"
          name="confirmPassword"
          type="password"
          margin="normal"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleRegister}
          sx={{ mt: 2, py: 1.5 }}
        >
          Register
        </Button>

        <Box textAlign="center" mt={2}>
          <Link href="/" underline="hover">
            Sudah punya akun? Login
          </Link>
        </Box>
      </Paper>

      {/* ✅ Dialog sukses */}
      <Dialog open={successDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Registrasi Berhasil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Selamat! Akun kamu berhasil dibuat. Login terlebih dahulu.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="contained" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
