import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

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
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Register gagal.");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Register
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

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
        sx={{ mt: 2 }}
        onClick={handleRegister}
      >
        Register
      </Button>
      <Box textAlign="center" mt={2}>
        <Link href="/">Sudah punya akun? Login</Link>
      </Box>
    </Container>
  );
}
