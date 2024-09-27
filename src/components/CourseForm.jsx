import { useState, useEffect, useRef } from "react";
import { TextField, Button, Box, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import PropTypes from "prop-types";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");

const CourseForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [courseData, setCourseData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    teacher: initialData?.teacher || "",
  });
  const [teachers, setTeachers] = useState([]);
  const isMounted = useRef(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/getTeachers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeachers(response.data.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      setCourseData({
        title: initialData?.title || "",
        description: initialData?.description || "",
        teacher: initialData?.teacher || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSubmit === "function") {
      onSubmit(courseData);
    } else {
      console.error("onSubmit is not a function");
    }
  };

  // Check if the current teacher value is valid
  const isValidTeacher = teachers.some((teacher) => teacher._id === courseData.teacher);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <TextField
        label="Course Title"
        name="title"
        value={courseData?.title}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Description"
        name="description"
        value={courseData?.description}
        onChange={handleChange}
        fullWidth
        required
        multiline
        rows={4}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="teacher-select-label">Teacher</InputLabel>
        <Select
          labelId="teacher-select-label"
          id="teacher-select"
          name="teacher"
          value={isValidTeacher ? courseData.teacher : ""}
          label="Teacher"
          onChange={handleChange}
          required
        >
          {teachers.map((teacher) => (
            <MenuItem key={teacher._id} value={teacher._id}>
              {teacher.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Save Course
        </Button>
      </Box>
    </Box>
  );
};

CourseForm.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  initialData: PropTypes.object,
};

export default CourseForm;
