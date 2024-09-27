import { useState, useEffect } from "react";
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const SubmitAssignment = ({ refreshKey, onRefresh }) => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [submissionText, setSubmissionText] = useState("");

  useEffect(() => {
    fetchEnrolledCourses();
  }, [refreshKey]);

  useEffect(() => {
    if (selectedCourse) {
      fetchAssignments(selectedCourse);
    }
  }, [selectedCourse]);

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

  const fetchAssignments = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/assignments/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(response.data.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/assignments/submit`,
        {
          assignmentId: selectedAssignment,
          submissionText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Assignment submitted successfully");
      setSubmissionText("");
      setSelectedAssignment("");
      onRefresh();
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast.error("Failed to submit assignment");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Course</InputLabel>
        <Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
          {courses.map((course) => (
            <MenuItem key={course._id} value={course._id}>
              {course.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Assignment</InputLabel>
        <Select
          value={selectedAssignment}
          onChange={(e) => setSelectedAssignment(e.target.value)}
          required
          disabled={!selectedCourse}
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
        multiline
        rows={4}
        margin="normal"
        label="Submission Text"
        value={submissionText}
        onChange={(e) => setSubmissionText(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Submit Assignment
      </Button>
    </Box>
  );
};

SubmitAssignment.propTypes = {
  refreshKey: PropTypes.number.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default SubmitAssignment;
