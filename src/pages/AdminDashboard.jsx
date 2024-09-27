import { Container, Typography, Grid, Paper, Box } from "@mui/material";
import { useState, useEffect } from "react";
import CourseList from "../components/CourseList";
import StudentList from "../components/StudentList";
import TeacherList from "../components/TeacherList";
import AssignmentList from "../components/AssignmentList";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AdminDashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, [refreshKey]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/courses/getAllCourses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data.data.docs || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1" sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom component="h2">
              Teachers
            </Typography>
            <Box sx={{ height: "calc(100% - 40px)" }}>
              <TeacherList refreshKey={refreshKey} onRefresh={handleRefresh} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom component="h2">
              Students
            </Typography>
            <Box sx={{ height: "calc(100% - 40px)" }}>
              <StudentList refreshKey={refreshKey} onRefresh={handleRefresh} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom component="h2">
              Courses
            </Typography>
            <Box sx={{ height: "calc(100% - 40px)" }}>
              <CourseList courses={courses} onCourseSelect={() => {}} studentView={false} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom component="h2">
              Assignments
            </Typography>
            <Box sx={{ height: "calc(100% - 40px)" }}>
              <AssignmentList refreshKey={refreshKey} onRefresh={handleRefresh} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
