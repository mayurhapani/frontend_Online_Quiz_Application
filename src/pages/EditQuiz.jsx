import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Paper, Box, TextField, Button, IconButton } from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const EditQuiz = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", choices: ["", "", "", ""], correctAnswer: "" },
  ]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/quizzes/${id}`);
      const quiz = response.data.data;
      setTitle(quiz.title);
      setDescription(quiz.description);
      setQuestions(quiz.questions);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: "", choices: ["", "", "", ""], correctAnswer: "" }]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleChoiceChange = (questionIndex, choiceIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices[choiceIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${BASE_URL}/quizzes/editQuiz/${id}`,
        { title, description, questions },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Quiz
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Quiz Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          {questions.map((question, questionIndex) => (
            <Paper key={questionIndex} elevation={2} sx={{ p: 2, mb: 2 }}>
              <TextField
                label={`Question ${questionIndex + 1}`}
                value={question.text}
                onChange={(e) => handleQuestionChange(questionIndex, "text", e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              {question.choices.map((choice, choiceIndex) => (
                <TextField
                  key={choiceIndex}
                  label={`Choice ${choiceIndex + 1}`}
                  value={choice}
                  onChange={(e) => handleChoiceChange(questionIndex, choiceIndex, e.target.value)}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />
              ))}
              <TextField
                label="Correct Answer"
                value={question.correctAnswer}
                onChange={(e) =>
                  handleQuestionChange(questionIndex, "correctAnswer", e.target.value)
                }
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <Box display="flex" justifyContent="flex-end">
                <IconButton onClick={() => handleRemoveQuestion(questionIndex)} color="error">
                  <RemoveCircleOutline />
                </IconButton>
              </Box>
            </Paper>
          ))}
          <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddQuestion}
              startIcon={<AddCircleOutline />}
            >
              Add Question
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update Quiz
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditQuiz;
