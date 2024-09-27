import { useState, useEffect } from "react";
import { Box, Button, FormControl, InputLabel, Select, MenuItem, Chip } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const EnrollStudents = ({ courseId, onEnrollmentComplete }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

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

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/courses/${courseId}/enroll`,
        {
          studentIds: selectedStudents,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Students enrolled successfully");
      setSelectedStudents([]);
      if (onEnrollmentComplete) onEnrollmentComplete();
    } catch (error) {
      console.error("Error enrolling students:", error);
      toast.error("Failed to enroll students");
    }
  };

  return (
    <Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>Enroll Students</InputLabel>
        <Select
          multiple
          value={selectedStudents}
          onChange={(e) => setSelectedStudents(e.target.value)}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={students.find((s) => s._id === value)?.name || value} />
              ))}
            </Box>
          )}
        >
          {students.map((student) => (
            <MenuItem key={student._id} value={student._id}>
              {student.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button onClick={handleEnroll} variant="contained" color="primary">
        Enroll Selected Students
      </Button>
    </Box>
  );
};

EnrollStudents.propTypes = {
  courseId: PropTypes.string.isRequired,
  onEnrollmentComplete: PropTypes.func.isRequired,
};

export default EnrollStudents;
