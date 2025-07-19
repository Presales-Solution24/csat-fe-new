import { useState, useEffect } from "react";
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
import Logo from "../assets/euat_logo.png"; // Pastikan file logo disimpan di src/assets/logo.png

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleLogin = async () => {
    const { username, password } = form;
    if (!username || !password) return setError("Username dan password wajib diisi.");

    try {
      const res = await API.post("/login", { username, password });
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("token", res.data.token);
      setSuccessDialogOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal.");
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
            e-UAT Portal
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
          margin="normal"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          sx={{ mt: 2, py: 1.5 }}
        >
          Login
        </Button>

        <Box textAlign="center" mt={2}>
          <Link href="/register" underline="hover">
            Belum punya akun? Daftar
          </Link>
        </Box>
      </Paper>

      {/* ✅ Dialog sukses */}
      <Dialog open={successDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Login Berhasil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Selamat datang kembali! Kamu akan diarahkan ke dashboard.
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
