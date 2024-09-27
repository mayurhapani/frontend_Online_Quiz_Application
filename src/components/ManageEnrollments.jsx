import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ManageEnrollments = ({ courses, refreshAssignments }) => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    if (selectedCourse) {
      fetchStudents();
    }
  }, [selectedCourse]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/users/getUsers?role=student`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data.data.docs);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    setSelectedStudents([]);
  };

  const handleStudentChange = (event) => {
    setSelectedStudents(event.target.value);
  };

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/courses/${selectedCourse}/enroll`,
        { studentIds: selectedStudents },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Students enrolling successfully");
      refreshAssignments();
      setSelectedCourse("");
      setSelectedStudents([]);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error enrolling students:", error);
    }
  };

  return (
    <Paper sx={{ p: 2, height: 600, display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" gutterBottom>
        Manage Enrollments
      </Typography>
      {courses.length > 0 ? (
        <>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel id="course-select-label">Select Course</InputLabel>
            <Select
              labelId="course-select-label"
              value={selectedCourse}
              onChange={handleCourseChange}
              label="Select Course"
            >
              {courses.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedCourse && (
            <>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel id="student-select-label">Select Students</InputLabel>
                <Select
                  labelId="student-select-label"
                  multiple
                  value={selectedStudents}
                  onChange={handleStudentChange}
                  label="Select Students"
                >
                  {students.map((student) => (
                    <MenuItem key={student._id} value={student._id}>
                      {student.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" color="primary" onClick={handleEnroll}>
                Enroll Selected Students
              </Button>
            </>
          )}
        </>
      ) : (
        <Typography variant="body1">No courses available.</Typography>
      )}
    </Paper>
  );
};

ManageEnrollments.propTypes = {
  courses: PropTypes.array.isRequired,
  refreshAssignments: PropTypes.func.isRequired,
};

export default ManageEnrollments;
