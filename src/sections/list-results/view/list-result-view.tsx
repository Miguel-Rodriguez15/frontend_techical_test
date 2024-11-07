import type { Test, Students } from 'src/sections/register-result/interface/indext';

import { useState, useEffect } from 'react';

import {
  Box,
  Table,
  Paper,
  Select,
  Button,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  InputLabel,
  FormControl,
  TableContainer,
} from '@mui/material';

import axiosInstance from 'src/axios';

import type { ResultRow } from '../interface/indext';



export default function ListResultView() {
  const [formData, setFormData] = useState({
    studentId: '',
    testId: '',
    questionId: '',
    answer: ''
  });

  const [students, setStudents] = useState<Students[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [isSorted, setIsSorted] = useState(false); 
  
  

  const handleConsult = async () => {
    const { studentId, testId } = formData;

    if (!studentId || !testId) {
      alert('Por favor, selecciona un estudiante y una prueba.');
      return;
    }

    try {
      const response = await axiosInstance.get(`result/search`, {
        params: {
          userId: studentId,
          testId
        }
      });

      const transformedResults = response.data.map((item: any) => ({
        questionNo: item.question.order, 
        correctAnswer: item.question.answer, 
        studentAnswer: item.answer, 
        isCorrect: item.answer === item.question.answer
      }));

      setResults(transformedResults); 
      console.log('Respuesta de la API:', transformedResults); 
    } catch (error) {
      console.error('Error al consultar resultados:', error);
    }
  };
  const sortResults = () => {
    const sortedResults = [...results].sort((a, b) => a.questionNo - b.questionNo);
    setResults(sortedResults);
    setIsSorted(true);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get('user');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get('user');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const fetchTestsByUserId = async (userId: string) => {
    try {
      const response = await axiosInstance.get(`user/found/${userId}/tests`);
      setTests(response.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const handleStudentChange = (event: any) => {
    const selectedStudentId = event.target.value;
    setFormData({ ...formData, studentId: selectedStudentId });
    
    fetchTestsByUserId(selectedStudentId);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 2 , background:'white'}}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="student-label">Estudiante</InputLabel>
          <Select
            labelId="student-label"
            id="student"
            name="studentId"
            value={formData.studentId}
            label="Estudiante"
            onChange={handleStudentChange} 
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
            onChange={(event) => setFormData({ ...formData, testId: event.target.value })} 
          >
            {tests.map((test) => (
              <MenuItem key={test.id} value={test.id}>
                {test.name} ({test.year})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleConsult}
          sx={{
            bgcolor: '#007FFF',
            color: 'white',
            '&:hover': {
              bgcolor: '#0066CC'
            },
            height: 56
          }}
        >
          Consultar
        </Button>
        <Button
          variant="outlined"
          onClick={sortResults}
          disabled={results.length === 0}
          sx={{
            height: 56
          }}
        >
          Ordenar
        </Button>
      </Box>

      <TableContainer component={Paper} >
        <Table sx={{ minWidth: 650 }} aria-label="results table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Pregunta No.</TableCell>
              <TableCell>Respuesta Correcta</TableCell>
              <TableCell>Respuesta Estudiante</TableCell>
              <TableCell>Acierto</TableCell> 
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row) => (
              <TableRow key={row.questionNo} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{row.questionNo}</TableCell>
                <TableCell>{row.correctAnswer}</TableCell>
                <TableCell>{row.studentAnswer}</TableCell>
                <TableCell>{row.isCorrect ? 'Si' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}