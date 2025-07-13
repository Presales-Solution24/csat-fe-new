// theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2", // biru utama
      light: "#63a4ff",
      dark: "#004ba0",
    },
    secondary: {
      main: "#00acc1", // aksen toska
      light: "#5ddef4",
      dark: "#007c91",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e1e1e",
      secondary: "#5f6368",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 500,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

export default theme;
