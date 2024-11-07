import type { SelectChangeEvent } from '@mui/material/Select';

import React, { useState, useEffect } from 'react';

import { Box, Button, Select, MenuItem, Container, TextField, InputLabel, FormControl } from '@mui/material';

import axiosInstance from 'src/axios';
import { DashboardContent } from 'src/layouts/dashboard';

export interface Students {
  id: string;
  email: string;
  fullName: string;
  document: string;
  isActive: boolean;
  grade: string;
  classroom: string;
}

export interface Test {
  id: string;
  name: string;
  year: number;
}

export interface Question {
  id: string;
  answer: string;
  order: number;
}

function RegisterResultView() {
  const [formData, setFormData] = useState({
    studentId: '',
    testId: '',
    questionId: '',
    answer: ''
  });

  const [students, setStudents] = useState<Students[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get('user');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    const fetchTests = async () => {
      try {
        const response = await axiosInstance.get('test');
        setTests(response.data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchStudents();
    fetchTests();
  }, []);

  const fetchQuestions = async (testId: string) => {
    try {
      const response = await axiosInstance.get(`question/test/${testId}`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'testId') {
      fetchQuestions(value);
    }
  };

  const submitResults = async () => {
    try {
      const response = await axiosInstance.post('result/register', {
        studentId: formData.studentId,
        testId: formData.testId,
        questionId: formData.questionId,
        answer: formData.answer
      });

      console.log('Results submitted successfully:', response.data);
      alert('Results submitted successfully:')
    } catch (error) {
      console.error('Error submitting results:', error.response ? error.response.data : error.message);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitResults();
  };

  return (
    <DashboardContent>
      <Container maxWidth="sm" style={{ background: 'white' }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            py: 2
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="student-label">Estudiante</InputLabel>
            <Select
              labelId="student-label"
              id="student"
              name="studentId"
              value={formData.studentId}
              label="Estudiante"
              onChange={handleChange}
            >
              {students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="test-label">Prueba</InputLabel>
            <Select
              labelId="test-label"
              id="test"
              name="testId"
              value={formData.testId}
              label="Prueba"
              onChange={handleChange}
            >
              {tests.map((test) => (
                <MenuItem key={test.id} value={test.id}>
                  {test.name} ({test.year})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="question-label">Pregunta</InputLabel>
            <Select
              labelId="question-label"
              id="question"
              name="questionId"
              value={formData.questionId}
              label="Pregunta"
              onChange={handleChange}
            >
              {questions.map((question) => (
                <MenuItem key={question.id} value={question.id}>
                  Pregunta {question.order}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            id="answer"
            name="answer"
            label="Respuesta"
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            variant="outlined"
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: '#007FFF',
              color: 'white',
              '&:hover': {
                bgcolor: '#0066CC'
              },
              py: 1.5
            }}
          >
            Consultar
          </Button>
        </Box>
      </Container>
    </DashboardContent>
  );
}

export default RegisterResultView;