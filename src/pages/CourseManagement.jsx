import { useState, useEffect } from "react";
import { Container, Typography, Grid, Paper } from "@mui/material";
import CourseForm from "../components/CourseForm";
import CourseList from "../components/CourseList";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem("token");

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/courses/getAllCourses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(response.data.data.docs);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (courseData) => {
    try {
      const response = await axios.post(`${BASE_URL}/courses/createCourse`, courseData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses([...courses, response.data.data]);
      toast.success("Course created successfully!");
    } catch (error) {
      toast.error("Failed to create course");
      console.error("Error creating course:", error);
    }
  };

  const handleCourseSelect = (course) => {
    console.log("Selected course:", course);
  };

  return (
    <Container maxWidth="lg" className="mt-10">
      <Typography variant="h4" gutterBottom>
        Course Management
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Typography variant="h6" gutterBottom>
              Add/Edit Course
            </Typography>
            <CourseForm onSubmit={handleSubmit} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Typography variant="h6" gutterBottom>
              Courses
            </Typography>
            <CourseList courses={courses} onCourseSelect={handleCourseSelect} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseManagement;
