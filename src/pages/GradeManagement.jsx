import { Container, Typography, Grid, Paper } from "@mui/material";
import GradeList from "../components/GradeList";
import StudentList from "../components/StudentList";

const GradeManagement = () => {
  return (
    <Container maxWidth="lg" className="mt-10">
      <Typography variant="h4" gutterBottom>
        Grade Management
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Typography variant="h6" gutterBottom>
              Students
            </Typography>
            <StudentList />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Typography variant="h6" gutterBottom>
              Grades
            </Typography>
            <GradeList />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GradeManagement;
