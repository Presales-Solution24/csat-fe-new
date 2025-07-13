import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  CircularProgress,
  Button,
  Collapse,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import MainLayout from "../components/MainLayout";

export default function ProjectSatisfactionList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRows, setOpenRows] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/project-satisfaction");
      setProjects(res.data);
    } catch (error) {
      console.error("Failed to fetch project list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRow = (projectId) => {
    setOpenRows((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const handleEdit = (projectId) => {
    navigate(`/project-satisfaction/edit?edit=${projectId}`);
  };

  const handleAdd = () => {
    navigate("/project-satisfaction");
  };

  const handleDownload = (projectId) => {
    navigate(`/project-review-pdf?projectId=${projectId}&download=true`);
  };

  const handleDeleteClick = (projectId) => {
    setSelectedProjectId(projectId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/project-satisfaction/${selectedProjectId}`);
      alert("Project berhasil dihapus.");
      fetchProjects();
    } catch (error) {
      console.error("Gagal menghapus project:", error);
      alert("Gagal menghapus project.");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedProjectId(null);
    }
  };

  return (
    <MainLayout>
      <Container sx={{ mt: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            📋 Project Satisfaction List
          </Typography>
          <Button variant="contained" onClick={handleAdd}>
            Add Project
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={6}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{ borderRadius: 2, overflowX: "auto", width: "100%" }}
          >
            <Table stickyHeader sx={{ minWidth: "1000px" }}>
              <TableHead sx={{ backgroundColor: "#f0f4f8" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 0,
                      zIndex: 2,
                      backgroundColor: "#f0f4f8",
                    }}
                  />
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      position: "sticky",
                      left: 48,
                      zIndex: 2,
                      backgroundColor: "#f0f4f8",
                      minWidth: 180,
                    }}
                  >
                    Nama Company
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Nama Project</TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      position: "sticky",
                      left: 300,
                      zIndex: 2,
                      backgroundColor: "#f0f4f8",
                      minWidth: 180,
                    }}
                  >
                    Nama Presales
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type Product</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    Kategori Product
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Approved</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Score</TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      position: "sticky",
                      right: 0,
                      zIndex: 2,
                      backgroundColor: "#f0f4f8",
                    }}
                  >
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project) => {
                  const isOpen = openRows[project.id];
                  return (
                    <React.Fragment key={project.id}>
                      <TableRow
                        hover
                        sx={{
                          backgroundColor: isOpen ? "#f9f9f9" : "inherit",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        <TableCell
                          sx={{
                            position: "sticky",
                            left: 0,
                            backgroundColor: "#fff",
                            zIndex: 1,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleToggleRow(project.id)}
                          >
                            {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
                          </IconButton>
                        </TableCell>
                        <TableCell
                          sx={{
                            position: "sticky",
                            left: 48,
                            backgroundColor: "#fff",
                            zIndex: 1,
                            minWidth: 180,
                          }}
                        >
                          {project.customer_name || "-"}
                        </TableCell>
                        <TableCell>{project.project_name || "-"}</TableCell>
                        <TableCell
                          sx={{
                            position: "sticky",
                            left: 300,
                            backgroundColor: "#fff",
                            zIndex: 1,
                            minWidth: 180,
                          }}
                        >
                          {project.nama_presales || "-"}
                        </TableCell>
                        <TableCell>{project.tipe_produk || "-"}</TableCell>
                        <TableCell>{project.kategori_produk || "-"}</TableCell>
                        <TableCell>
                          {project.approve ? (
                            <Box
                              component="span"
                              sx={{
                                display: "inline-block",
                                px: 1.5,
                                py: 0.3,
                                backgroundColor: "#d0f5e8",
                                color: "#087f5b",
                                borderRadius: 1,
                                fontSize: "12px",
                                fontWeight: 600,
                              }}
                            >
                              Yes ✅
                            </Box>
                          ) : (
                            <Box
                              component="span"
                              sx={{
                                display: "inline-block",
                                px: 1.5,
                                py: 0.3,
                                backgroundColor: "#f0f0f0",
                                color: "#999",
                                borderRadius: 1,
                                fontSize: "12px",
                                fontWeight: 500,
                              }}
                            >
                              No ❌
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>{project.score || "-"}</TableCell>
                        <TableCell
                          sx={{
                            position: "sticky",
                            right: 0,
                            backgroundColor: "#fff",
                            zIndex: 1,
                          }}
                        >
                          <Box display="flex" gap={1} flexWrap="wrap">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleEdit(project.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              disabled={!project.approve}
                              onClick={() => handleDownload(project.id)}
                            >
                              PDF
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleDeleteClick(project.id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={9}
                        >
                          <Collapse in={isOpen} timeout="auto" unmountOnExit>
                            <Box
                              sx={{
                                margin: 2,
                                backgroundColor: "#f5f5f5",
                                borderRadius: 1,
                                p: 2,
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                gutterBottom
                                sx={{ fontWeight: 600 }}
                              >
                                📝 Tasks
                              </Typography>
                              {project.tasks && project.tasks.length > 0 ? (
                                <Table size="small">
                                  <TableHead
                                    sx={{ backgroundColor: "#e3eaf1" }}
                                  >
                                    <TableRow>
                                      <TableCell sx={{ fontWeight: 600 }}>
                                        Task
                                      </TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>
                                        Expected Result
                                      </TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>
                                        Actual Result
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {project.tasks.map((task, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell>{task.task_name}</TableCell>
                                        <TableCell>
                                          {task.expected_result}
                                        </TableCell>
                                        <TableCell>
                                          {task.actual_result}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 1 }}
                                >
                                  No tasks available.
                                </Typography>
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Yakin ingin menghapus project ini? Semua task yang terkait juga
              akan dihapus.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Batal</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Hapus
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
}
