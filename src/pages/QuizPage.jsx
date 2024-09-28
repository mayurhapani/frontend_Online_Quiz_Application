import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const QuizPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/quizzes/${id}`);
      setQuiz(response.data.data);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      questionId: quiz.questions[currentQuestionIndex]._id,
      userAnswer: selectedAnswer,
    };
    setAnswers(newAnswers);

    if (quiz.questions[currentQuestionIndex].correctAnswer === selectedAnswer) {
      setScore(score + 1);
    }
    setSelectedAnswer("");
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowScore(true);
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (answers) => {
    try {
      await axios.post(
        `${BASE_URL}/quizzes/submit`,
        {
          quizId: id,
          answers: answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      navigate(`/result/${id}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (!quiz) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {quiz.title}
      </Typography>
      {showScore ? (
        <Typography variant="h5">
          Your score: {score} / {quiz.questions.length}
        </Typography>
      ) : (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {quiz.questions[currentQuestionIndex].text}
          </Typography>
          <RadioGroup value={selectedAnswer} onChange={handleAnswerChange}>
            {quiz.questions[currentQuestionIndex].choices.map((choice, index) => (
              <FormControlLabel key={index} value={choice} control={<Radio />} label={choice} />
            ))}
          </RadioGroup>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
          >
            {currentQuestionIndex < quiz.questions.length - 1 ? "Next" : "Submit"}
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default QuizPage;
