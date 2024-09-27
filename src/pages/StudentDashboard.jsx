import { useState, useEffect } from "react";
import { Container, Typography, Grid, Paper, Box } from "@mui/material";
import CourseList from "../components/CourseList.jsx";
import GradeList from "../components/GradeList.jsx";
import AssignmentList from "../components/AssignmentList.jsx";
import CourseProgress from "../components/CourseProgress.jsx";
import SubmitAssignment from "../components/SubmitAssignment.jsx";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const StudentDashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, [refreshKey]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/courses/enrolled`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Student Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              My Courses
            </Typography>
            <Box sx={{ height: "calc(100% - 40px)", overflow: "auto" }}>
              <CourseList courses={courses} onCourseSelect={() => {}} studentView={true} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              My Grades
            </Typography>
            <Box sx={{ height: "calc(100% - 40px)", overflow: "auto" }}>
              <GradeList refreshKey={refreshKey} onRefresh={handleRefresh} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Assignments
            </Typography>
            <Box sx={{ height: "calc(100% - 40px)", overflow: "auto" }}>
              <AssignmentList
                refreshKey={refreshKey}
                onRefresh={handleRefresh}
                studentView={true}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Course Progress
            </Typography>
            <Box sx={{ height: "calc(100% - 40px)", overflow: "hidden" }}>
              <CourseProgress refreshKey={refreshKey} onRefresh={handleRefresh} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Submit Assignment
            </Typography>
            <Box sx={{ height: "calc(100% - 40px)", overflow: "auto" }}>
              <SubmitAssignment refreshKey={refreshKey} onRefresh={handleRefresh} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard;
