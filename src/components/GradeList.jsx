import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import EditGradeForm from "./EditGradeForm"; // You'll need to create this component

const BASE_URL = import.meta.env.VITE_BASE_URL;

const GradeList = ({ refreshKey }) => {
  const [grades, setGrades] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [totalGrades, setTotalGrades] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [gradeToDelete, setGradeToDelete] = useState(null);

  useEffect(() => {
    fetchGrades();
    checkUserRole();
  }, [page, refreshKey]);

  const checkUserRole = () => {
    const userRole = localStorage.getItem("userRole");
    setIsAdmin(userRole === "admin");
    setIsTeacher(userRole === "teacher");
  };

  const fetchGrades = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BASE_URL}/grades?page=${page + 1}&limit=${rowsPerPage}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) {
        setGrades(response.data.data.docs || []);
        setTotalGrades(response.data.data.totalDocs || 0);
      } else {
        console.error("Unexpected API response structure:", response.data);
        setGrades([]);
        setTotalGrades(0);
      }
    } catch (error) {
      console.error("Error fetching grades:", error.response?.data || error.message);
      setGrades([]);
      setTotalGrades(0);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingGrade(null);
  };

  const handleUpdateGrade = async (updatedGrade) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${BASE_URL}/grades/${updatedGrade._id}`, updatedGrade, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Grade updated successfully");
      fetchGrades();
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating grade:", error);
      toast.error("Failed to update grade");
    }
  };

  const handleDeleteGrade = (grade) => {
    setGradeToDelete(grade);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setGradeToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/grades/${gradeToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Grade deleted successfully");
      fetchGrades();
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting grade:", error);
      toast.error("Failed to delete grade");
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <TableContainer sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Grade</TableCell>
              {(isAdmin || isTeacher) && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.map((grade) => (
              <TableRow
                key={grade._id}
                sx={{
                  height: "40px",
                  "&:nth-of-type(odd)": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                <TableCell>{grade.student.name}</TableCell>
                <TableCell>{grade.course.title}</TableCell>
                <TableCell>{grade.grade}</TableCell>
                {(isAdmin || isTeacher) && (
                  <TableCell>
                    <IconButton onClick={() => handleEditGrade(grade)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteGrade(grade)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {Array.from({ length: Math.max(0, rowsPerPage - grades.length) }).map((_, index) => (
              <TableRow
                key={`empty-${index}`}
                sx={{
                  height: "40px",
                  "&:nth-of-type(odd)": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                <TableCell colSpan={isAdmin || isTeacher ? 4 : 3} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalGrades}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[]}
      />

      {/* Edit Grade Modal */}
      <Dialog open={isEditModalOpen} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Grade</DialogTitle>
        <DialogContent>
          {editingGrade && (
            <EditGradeForm
              initialData={{
                _id: editingGrade._id,
                student: { name: editingGrade.student.name },
                course: { title: editingGrade.course.title },
                assignment: { title: editingGrade.assignment.title },
                grade: editingGrade.grade,
              }}
              onSubmit={handleUpdateGrade}
              onCancel={handleCloseEditModal}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Grade Modal */}
      <Dialog open={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this grade?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

GradeList.propTypes = {
  refreshKey: PropTypes.number.isRequired,
};

export default GradeList;
