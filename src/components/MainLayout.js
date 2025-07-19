import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ListAlt as ListAltIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import logo from "../assets/euat_logo.png";

const drawerWidth = 260;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  {
    text: "Project Satisfaction List",
    icon: <ListAltIcon />,
    path: "/project-satisfaction-list",
  },
  {
    text: "Add Project Satisfaction",
    icon: <AddCircleOutlineIcon />,
    path: "/project-satisfaction",
  },
  {
    text: "Project Upload",
    icon: <AddCircleOutlineIcon />,
    path: "/project-upload",
  },
  {
    text: "Product Type",
    icon: <AddCircleOutlineIcon />,
    path: "/product-type-list",
  },
  { text: "Logout", icon: <LogoutIcon />, path: "/logout" },
];

export default function MainLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path) => {
    if (path === "/logout") {
      setOpenLogoutDialog(true); // buka dialog konfirmasi logout
    } else {
      navigate(path);
    }
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setOpenLogoutDialog(false);
    navigate("/", { replace: true });
  };

  const handleCancelLogout = () => {
    setOpenLogoutDialog(false);
  };

  const username = localStorage.getItem("username") || "User";

  const drawerContent = (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pt: 3,
          pb: 2,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="e-uat logo"
          sx={{ height: 64, mb: 1, borderRadius: 2 }}
        />
        <Typography
          variant="subtitle1"
          sx={{ color: "text.secondary", fontWeight: 500 }}
        >
          Welcome,
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {username}
        </Typography>
      </Box>
      <Divider sx={{ mb: 1 }} />
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <Tooltip
                title={item.text}
                placement="right"
                arrow
                disableInteractive
              >
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: "8px",
                    m: "4px 12px",
                    backgroundColor: isActive
                      ? theme.palette.primary.light
                      : "transparent",
                    boxShadow: isActive ? 2 : 0,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                      transform: "scale(1.02)",
                      transition: "0.2s ease-in-out",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? theme.palette.primary.main : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? "bold" : "medium",
                      color: isActive ? theme.palette.primary.main : "inherit",
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* AppBar */}
        <AppBar
          position="fixed"
          elevation={1}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            background: "linear-gradient(90deg, #1976d2, #42a5f5)",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
              e-UAT Portal
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": { width: drawerWidth, pt: 8 },
            }}
          >
            {drawerContent}
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                backgroundColor: "#fefefe",
                boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
                pt: 8,
              },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            backgroundColor: "#f4f6f8",
            minHeight: "100vh",
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>

      {/* Konfirmasi Logout */}
      <Dialog open={openLogoutDialog} onClose={handleCancelLogout}>
        <DialogTitle>Konfirmasi Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin keluar dari sesi login?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLogout}>Batal</Button>
          <Button onClick={handleConfirmLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
