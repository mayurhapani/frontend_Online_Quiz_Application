import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Paper, Box, Button } from "@mui/material";
import axios from "axios";
import { getToken } from "../utils/tokenUtils";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ResultPage = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/responses/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        withCredentials: true,
      });

      setResult(response.data.data);
    } catch (error) {
      console.error("Error fetching result:", error);
    }
  };

  if (!result) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quiz Result
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Your score: {result.score} / {result.answers.length}
        </Typography>
        <Box sx={{ mt: 2 }}>
          {result.answers.map((answer, index) => (
            <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">{answer.questionId.text}</Typography>
              <Typography variant="body1">Your answer: {answer.userAnswer}</Typography>
              <Typography variant="body1">Correct answer: {answer.questionId.correctAnswer}</Typography>
            </Paper>
          ))}
        </Box>
        <Button variant="contained" color="primary" onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Paper>
    </Container>
  );
};

export default ResultPage;
