import { useState } from "react";
import {
  Container, TextField, Button, Typography, Box, Link, Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const { username, password } = form;

    if (!username || !password) {
      return setError("Username dan password wajib diisi.");
    }

    try {
      const res = await API.post("/login", { username, password });

      // Simpan data login ke localStorage jika diperlukan
      localStorage.setItem("username", res.data.username);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal.");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Login
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        fullWidth label="Username" margin="normal"
        value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <TextField
        fullWidth label="Password" type="password" margin="normal"
        value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleLogin}>
        Login
      </Button>
      <Box textAlign="center" mt={2}>
        <Link href="/register">Belum punya akun? Daftar</Link>
      </Box>
    </Container>
  );
}
