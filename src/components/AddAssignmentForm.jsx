import { useState, useEffect } from "react";
import { TextField, Button, Box, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AddAssignmentForm = ({ onClose, refreshAssignments }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]);

  console.log(courses);

  useEffect(() => {
    fetchCourses();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/assignments/create`,
        { title, description, dueDate, course: courseId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        toast.success("Assignment created successfully");
        refreshAssignments(); // Call this function to refresh the assignments list
        onClose();
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error("Failed to create assignment");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
        required
        multiline
        rows={4}
      />
      <TextField
        fullWidth
        label="Due Date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        margin="normal"
        required
        InputLabelProps={{ shrink: true }}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="course-select-label">Course</InputLabel>
        <Select
          labelId="course-select-label"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        >
          {courses?.map((course) => (
            <MenuItem key={course._id} value={course._id}>
              {course.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Create Assignment
      </Button>
    </Box>
  );
};

AddAssignmentForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  refreshAssignments: PropTypes.func.isRequired,
};

export default AddAssignmentForm;
