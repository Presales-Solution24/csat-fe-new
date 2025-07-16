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
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
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
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRows, setOpenRows] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [search, setSearch] = useState("");
  const [approvedFilter, setApprovedFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/project-satisfaction");
      setProjects(res.data);
      setFilteredProjects(res.data);
    } catch (error) {
      console.error("Failed to fetch project list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    filterProjects(value, approvedFilter);
  };

  const handleApprovedFilterChange = (e) => {
    const value = e.target.value;
    setApprovedFilter(value);
    filterProjects(search, value);
  };

  const filterProjects = (searchText, approvedVal) => {
    let result = projects.filter((p) => {
      const searchMatch =
        p.nama_company?.toLowerCase().includes(searchText) ||
        p.project_title?.toLowerCase().includes(searchText) ||
        p.nama_presales?.toLowerCase().includes(searchText);
      const approvedMatch =
        approvedVal === ""
          ? true
          : approvedVal === "1"
          ? p.approved === 1 || p.approved === "1"
          : p.approved === 0 || p.approved === "0";
      return searchMatch && approvedMatch;
    });
    setFilteredProjects(result);
  };

  const handleResetFilters = () => {
    setSearch("");
    setApprovedFilter("");
    setFilteredProjects(projects);
  };

  const handleToggleRow = (projectId) => {
    setOpenRows((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const handleEdit = (e, projectId) => {
    e.stopPropagation();
    navigate(`/project-satisfaction/edit?edit=${projectId}`);
  };

  const handleAdd = () => {
    navigate("/project-satisfaction");
  };

  const handleDownload = (e, projectId) => {
    e.stopPropagation();
    navigate(`/project-review-pdf?projectId=${projectId}&download=true`);
  };

  const handleDeleteClick = (e, projectId) => {
    e.stopPropagation();
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

        <Box display="flex" gap={2} mb={2} flexWrap="wrap">
          <TextField
            label="Search"
            value={search}
            onChange={handleSearchChange}
            size="small"
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Approval?</InputLabel>
            <Select
              value={approvedFilter}
              label="Approved"
              onChange={handleApprovedFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="1">Approved</MenuItem>
              <MenuItem value="0">Not Approved</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={handleResetFilters}>
            Reset
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
            sx={{ borderRadius: 2, overflowX: "auto" }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#f0f4f8" }}>
                <TableRow>
                  <TableCell />
                  <TableCell sx={{ fontWeight: 600 }}>Nama Company</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Nama Project</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Nama Presales</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type Product</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    Kategori Product
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Approved</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Score</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects.map((project) => {
                  const isOpen = openRows[project.id];
                  return (
                    <React.Fragment key={project.id}>
                      <TableRow
                        hover
                        onClick={() => handleToggleRow(project.id)}
                        sx={{
                          backgroundColor: isOpen ? "#f9f9f9" : "inherit",
                          cursor: "pointer",
                        }}
                      >
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleRow(project.id);
                            }}
                          >
                            {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
                          </IconButton>
                        </TableCell>
                        <TableCell>{project.nama_company || "-"}</TableCell>
                        <TableCell>{project.project_title || "-"}</TableCell>
                        <TableCell>{project.nama_presales || "-"}</TableCell>
                        <TableCell>{project.tipe_produk || "-"}</TableCell>
                        <TableCell>{project.kategori_produk || "-"}</TableCell>
                        <TableCell>
                          {project.approved ? (
                            <Box
                              sx={{
                                px: 1.5,
                                py: 0.3,
                                backgroundColor: "#d0f5e8",
                                color: "#087f5b",
                                borderRadius: 1,
                                fontSize: "12px",
                                fontWeight: 600,
                                display: "inline-block",
                              }}
                            >
                              Yes ✅
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                px: 1.5,
                                py: 0.3,
                                backgroundColor: "#f0f0f0",
                                color: "#999",
                                borderRadius: 1,
                                fontSize: "12px",
                                fontWeight: 500,
                                display: "inline-block",
                              }}
                            >
                              No ❌
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>{project.rating || "-"}</TableCell>
                        <TableCell>
                          <Box display="flex" gap={1} flexWrap="wrap">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={(e) => handleEdit(e, project.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              disabled={!project.approved}
                              onClick={(e) => handleDownload(e, project.id)}
                            >
                              PDF
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={(e) => handleDeleteClick(e, project.id)}
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
