import { Container, Typography, Grid, Paper, Button } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/quizzes`);
      setQuizzes(response.data.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`${BASE_URL}/quizzes/deleteQuiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Manage Quizzes
            </Typography>
            <Button
              component={Link}
              to="/create-quiz"
              variant="contained"
              color="primary"
              sx={{ mb: 2 }}
            >
              Create New Quiz
            </Button>
            <Grid container spacing={3}>
              {quizzes.map((quiz) => (
                <Grid item xs={12} md={6} key={quiz._id}>
                  <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {quiz.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {quiz.description}
                    </Typography>
                    <Button
                      component={Link}
                      to={`/edit-quiz/${quiz._id}`}
                      variant="contained"
                      color="secondary"
                      sx={{ mr: 2 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteQuiz(quiz._id)}
                    >
                      Delete
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
