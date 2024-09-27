import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const EditGradeForm = ({ initialData, onSubmit, onCancel }) => {
  const [grade, setGrade] = useState(initialData.grade);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...initialData, grade: parseFloat(grade) });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Student: {initialData.student.name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Course: {initialData.course.title}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Assignment: {initialData.assignment.title}
      </Typography>
      <TextField
        fullWidth
        label="Grade"
        type="number"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        margin="normal"
        required
        inputProps={{ min: 0, max: 100, step: "0.1" }}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Update Grade
        </Button>
      </Box>
    </Box>
  );
};

EditGradeForm.propTypes = {
  initialData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    student: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    course: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
    assignment: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
    grade: PropTypes.number.isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EditGradeForm;
