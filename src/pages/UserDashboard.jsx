import { useState, useEffect } from "react";
import { Container, Typography, Grid, Paper, Button } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import { getToken } from "../utils/tokenUtils";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const UserDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/quizzes/with-responses`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        withCredentials: true,
      });
      setQuizzes(response.data.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Available Quizzes
      </Typography>
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
              {quiz.response ? (
                <Typography variant="body1" gutterBottom>
                  Your score: {quiz.response.score} / {quiz.questions.length}
                </Typography>
              ) : (
                <Button
                  component={Link}
                  to={`/quiz/${quiz._id}`}
                  variant="contained"
                  color="primary"
                >
                  Start Quiz
                </Button>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserDashboard;
