import { useState, useCallback, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
} from "@mui/material";
import CourseList from "../components/CourseList";
import AssignmentList from "../components/AssignmentList";
import GradeList from "../components/GradeList";
import AddAssignmentForm from "../components/AddAssignmentForm";
import AddGradeForm from "../components/AddGradeForm";
import ManageEnrollments from "../components/ManageEnrollments";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const TeacherDashboard = () => {
  const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
  const [openGradeDialog, setOpenGradeDialog] = useState(false);
  const [refreshAssignmentKey, setRefreshAssignmentKey] = useState(0);
  const [refreshGradeKey, setRefreshGradeKey] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    fetchUserRole();
    fetchCourses();
  }, []);

  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/users/getUser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserRole(response.data.data.role);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const url =
        userRole === "admin" ? `${BASE_URL}/courses` : `${BASE_URL}/courses/teacherCourses`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data.data.docs);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleOpenAssignmentDialog = () => setOpenAssignmentDialog(true);
  const handleCloseAssignmentDialog = () => setOpenAssignmentDialog(false);
  const handleOpenGradeDialog = () => setOpenGradeDialog(true);
  const handleCloseGradeDialog = () => setOpenGradeDialog(false);

  const refreshAssignments = useCallback(() => {
    setRefreshAssignmentKey((prevKey) => prevKey + 1);
  }, []);

  const refreshGrades = useCallback(() => {
    setRefreshGradeKey((prevKey) => prevKey + 1);
  }, []);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };

  return (
    <Container maxWidth="lg" className="mt-10">
      <Typography variant="h4" gutterBottom>
        Teacher Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 600, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" gutterBottom>
              Courses
            </Typography>
            <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
              <CourseList courses={courses} onCourseSelect={handleCourseSelect} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 600, display: "flex", flexDirection: "column" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Assignments</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenAssignmentDialog}
                size="small"
              >
                Add New Assignment
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
              <AssignmentList refreshKey={refreshAssignmentKey} courseId={selectedCourse?._id} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 600, display: "flex", flexDirection: "column" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Grades</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenGradeDialog}
                size="small"
              >
                Add New Grade
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
              <GradeList refreshKey={refreshGradeKey} courseId={selectedCourse?._id} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <ManageEnrollments courses={courses} refreshAssignments={refreshAssignments} />
        </Grid>
      </Grid>

      <Dialog open={openAssignmentDialog} onClose={handleCloseAssignmentDialog}>
        <DialogTitle>Add New Assignment</DialogTitle>
        <DialogContent>
          <AddAssignmentForm
            onClose={handleCloseAssignmentDialog}
            refreshAssignments={refreshAssignments}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openGradeDialog} onClose={handleCloseGradeDialog}>
        <DialogTitle>Add New Grade</DialogTitle>
        <DialogContent>
          <AddGradeForm onClose={handleCloseGradeDialog} refreshGrades={refreshGrades} />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default TeacherDashboard;
