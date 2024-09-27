import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AssignmentList = ({ refreshKey, studentView }) => {
  const [assignments, setAssignments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [isTeacherOrAdmin, setIsTeacherOrAdmin] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [submittedAssignments, setSubmittedAssignments] = useState({});

  useEffect(() => {
    fetchAssignments();
    if (studentView) {
      fetchSubmittedAssignments();
    }
    checkUserRole();
  }, [page, refreshKey, studentView]);

  const checkUserRole = () => {
    const userRole = localStorage.getItem("userRole");
    setIsTeacherOrAdmin(userRole === "admin" || userRole === "teacher");
  };

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const url = studentView
        ? `${BASE_URL}/assignments/enrolled`
        : `${BASE_URL}/assignments?page=${page + 1}&limit=${rowsPerPage}`;

      const response = await axios.get(url, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) {
        setAssignments(response.data.data.docs || []);
        setTotalAssignments(response.data.data.totalDocs || 0);
      } else {
        console.error("Unexpected API response structure:", response.data);
        setAssignments([]);
        setTotalAssignments(0);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error.response?.data || error.message);
      setAssignments([]);
      setTotalAssignments(0);
    }
  };

  const fetchSubmittedAssignments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/assignments/submitted`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAssignments(response.data.data);

      const submittedMap = {};
      response?.data?.data?.forEach((submission) => {
        submittedMap[submission.assignment] = true;
      });

      setSubmittedAssignments(submittedMap);
    } catch (error) {
      console.error("Error fetching submitted assignments:", error);
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setOpenEditDialog(true);
  };

  const handleDelete = async (assignmentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Assignment deleted successfully");
      fetchAssignments();
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast.error("Failed to delete assignment");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingAssignment(null);
  };

  const handleUpdateAssignment = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${BASE_URL}/assignments/${editingAssignment._id}`, editingAssignment, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Assignment updated successfully");
      handleCloseEditDialog();
      fetchAssignments();
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast.error("Failed to update assignment");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingAssignment((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <TableContainer sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Course</TableCell>
              {studentView && <TableCell>Submitted</TableCell>}
              {isTeacherOrAdmin && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {isTeacherOrAdmin
              ? assignments.map((assignment) => (
                  <TableRow
                    key={assignment._id}
                    sx={{
                      height: "40px",
                      "&:nth-of-type(odd)": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                    }}
                  >
                    <TableCell>{assignment.title}</TableCell>
                    <TableCell>{assignment.description}</TableCell>
                    <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{assignment.course ? assignment.course.title : "N/A"}</TableCell>

                    <TableCell>
                      <IconButton size="small" onClick={() => handleEdit(assignment)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(assignment._id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              : assignments.map((assignment) => (
                  <TableRow
                    key={assignment.assignment._id}
                    sx={{
                      height: "40px",
                      "&:nth-of-type(odd)": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                    }}
                  >
                    <TableCell>{assignment.assignment.title}</TableCell>
                    <TableCell>{assignment.assignment.description}</TableCell>
                    <TableCell>
                      {new Date(assignment.assignment.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {assignment.assignment.course ? assignment.assignment.course.title : "N/A"}
                    </TableCell>

                    <TableCell>
                      {submittedAssignments[assignment.assignment._id] ? "Yes" : "No"}
                    </TableCell>
                  </TableRow>
                ))}
            {Array.from({ length: Math.max(0, rowsPerPage - assignments.length) }).map(
              (_, index) => (
                <TableRow
                  key={`empty-${index}`}
                  sx={{
                    height: "40px",
                    "&:nth-of-type(odd)": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                  }}
                >
                  <TableCell colSpan={5} />
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalAssignments}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[]}
      />

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Assignment</DialogTitle>
        <DialogContent>
          {editingAssignment && (
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={editingAssignment.title}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={editingAssignment.description}
                onChange={handleInputChange}
                margin="normal"
                required
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                label="Due Date"
                name="dueDate"
                type="date"
                value={editingAssignment.dueDate.split("T")[0]}
                onChange={handleInputChange}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleUpdateAssignment} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

AssignmentList.propTypes = {
  refreshKey: PropTypes.number.isRequired,
  studentView: PropTypes.bool,
};

export default AssignmentList;
