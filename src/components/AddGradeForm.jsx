import { useState, useEffect } from "react";
import { TextField, Button, Box, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AddGradeForm = ({ onClose, refreshGrades }) => {
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [assignmentId, setAssignmentId] = useState("");
  const [grade, setGrade] = useState("");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courseId) {
      fetchAssignments(courseId);
    }
  }, [courseId]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/users/getUsers?role=student`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data.data.docs);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students");
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/courses/getAllCourses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data.data.docs);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    }
  };

  const fetchAssignments = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/assignments?course=${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(response.data.data.docs);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("Failed to fetch assignments");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/grades/create`,
        { student: studentId, course: courseId, assignment: assignmentId, grade },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        toast.success("Grade added successfully");
        refreshGrades(); // Call this function to refresh the grades list
        onClose();
      }
    } catch (error) {
      console.error("Error adding grade:", error);
      toast.error("Failed to add grade");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <FormControl fullWidth margin="normal">
        <InputLabel id="student-select-label">Student</InputLabel>
        <Select
          labelId="student-select-label"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        >
          {students.map((student) => (
            <MenuItem key={student._id} value={student._id}>
              {student.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="course-select-label">Course</InputLabel>
        <Select
          labelId="course-select-label"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        >
          {courses.map((course) => (
            <MenuItem key={course._id} value={course._id}>
              {course.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="assignment-select-label">Assignment</InputLabel>
        <Select
          labelId="assignment-select-label"
          value={assignmentId}
          onChange={(e) => setAssignmentId(e.target.value)}
          required
          disabled={!courseId}
        >
          {assignments.map((assignment) => (
            <MenuItem key={assignment._id} value={assignment._id}>
              {assignment.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Grade"
        type="number"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        margin="normal"
        required
        inputProps={{ min: 0, max: 100 }}
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Add Grade
      </Button>
    </Box>
  );
};

AddGradeForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  refreshGrades: PropTypes.func.isRequired,
};

export default AddGradeForm;
