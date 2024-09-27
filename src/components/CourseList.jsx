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
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import CourseForm from "./CourseForm";
import PropTypes from "prop-types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const CourseList = ({ studentView, courses, onCourseSelect }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [totalCourses, setTotalCourses] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    fetchCourses();
    checkUserRole();
  }, [page, studentView]);

  const checkUserRole = () => {
    const userRole = localStorage.getItem("userRole");
    setIsAdmin(userRole === "admin");
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const url = studentView
        ? `${BASE_URL}/courses/enrolled`
        : `${BASE_URL}/courses/getAllCourses?page=${page + 1}&limit=${rowsPerPage}`;

      const response = await axios.get(url, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) {
        setTotalCourses(response.data.data.totalDocs || 0);
      } else {
        console.error("Unexpected API response structure:", response.data);
        setTotalCourses(0);
      }
    } catch (error) {
      console.error("Error fetching courses:", error.response?.data || error.message);
      setTotalCourses(0);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse({
      ...course,
      teacher: course.teacher?._id || "", // Use teacher ID instead of the whole object
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCourse(null); // Reset editingCourse when closing the modal
  };

  const handleUpdateCourse = async (updatedCourseData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${BASE_URL}/courses/update/${editingCourse._id}`, updatedCourseData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleDelete = (course) => {
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/courses/delete/${courseToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <TableContainer sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Teacher</TableCell>
              {!studentView && isAdmin && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow
                key={course._id}
                sx={{
                  height: "40px",
                  "&:nth-of-type(odd)": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
                onClick={() => onCourseSelect(course)}
              >
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell>{course.teacher?.name || "N/A"}</TableCell>
                {!studentView && isAdmin && (
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEdit(course)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(course)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {Array.from({ length: Math.max(0, rowsPerPage - courses.length) }).map((_, index) => (
              <TableRow
                key={`empty-${index}`}
                sx={{
                  height: "40px",
                  "&:nth-of-type(odd)": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                <TableCell colSpan={isAdmin ? 4 : 3} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalCourses}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[]}
      />

      {/* Edit Course Modal */}
      <Dialog open={isEditModalOpen} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          {editingCourse && (
            <CourseForm
              onSubmit={handleUpdateCourse}
              onCancel={handleCloseEditModal}
              initialData={editingCourse}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Course Modal */}
      <Dialog open={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the course &ldquo;{courseToDelete?.title}&rdquo;?
        </DialogContent>
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

CourseList.propTypes = {
  studentView: PropTypes.bool,
  courses: PropTypes.array.isRequired,
  onCourseSelect: PropTypes.func.isRequired,
};

export default CourseList;
