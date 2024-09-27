import { useState, useEffect } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const CourseProgress = ({ refreshKey }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchEnrolledCourses();
  }, [refreshKey]);

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/courses/enrolled`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourses(response.data.data);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    }
  };

  return (
    <Box>
      {courses?.map((course) => (
        <Box key={course._id} mb={2}>
          <Typography variant="subtitle1">{course.title}</Typography>
          <LinearProgress
            variant="determinate"
            value={course.progress || 0} // Ensure value is always defined
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Typography variant="body2" color="text.secondary">
            {`${Math.round(course.progress || 0)}% Complete`}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

CourseProgress.propTypes = {
  refreshKey: PropTypes.number.isRequired,
};

export default CourseProgress;
