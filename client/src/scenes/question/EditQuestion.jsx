/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const EditQuestion = ({base_url}) => {
    const { questionId } = useParams();
    const navigate = useNavigate();

    const [question, setQuestion] = useState({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        categoryId: '',
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const questionResponse = await axios.get(`${base_url}api/v1/question/single/${questionId}`);
                const questionData = questionResponse?.data?.question;

                // setQuestion({
                //     questionText: questionData.question,
                //     options: questionData.options,
                //     correctAnswer: questionData.answer, // Store the identifier
                //     categoryId: questionData.category._id,
                //     correctAnswerText: questionData.options[parseInt(questionData.answer.replace('option', '')) - 1], // Set correctAnswerText based on the identifier
                // });
                // Determine the correct answer's index based on the data
                const correctAnswerIndex = questionData?.options?.indexOf(questionData?.answer);

                setQuestion({
                    questionText: questionData?.question,
                    options: questionData?.options,
                    correctAnswer: `option${correctAnswerIndex + 1}`, // Set it as the identifier
                    categoryId: questionData?.category?._id,
                    correctAnswerText: questionData.options[correctAnswerIndex], // Set correctAnswerText based on the index
                });


                const categoriesResponse = await axios.get(`${base_url}api/v1/category/all`);
                setCategories(categoriesResponse?.data?.categories);

                setLoading(false);
            } catch (err) {
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchData();
    }, [questionId]);


    const handleSaveChanges = async (e) => {
        e.preventDefault()
        try {
            // Extract the correct answer text from the selected option
            const correctAnswerText = question.options[
                parseInt(question?.correctAnswer?.replace('option', '')) - 1
            ];
            // Create an object to send as the request body
            const updatedQuestion = {
                question: question?.questionText,
                options: question?.options,
                // answer: question.correctAnswerText, // Send the correct answer text
                answer: correctAnswerText,
                category: question?.categoryId,
            };

            // Send a PUT request to update the question
            await axios.put(`${base_url}api/v1/question/${questionId}`, updatedQuestion);

            // After successfully updating, navigate back to the question list
            navigate('/question');
        } catch (err) {
            setError('Error updating question');
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>Error: {error}</Typography>;
    }

    return (
        <>
            <Box p={3}>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h2" gutterBottom mb={4}>
                        Edit Question
                    </Typography>
                    <Link to="/question">
                        <Button variant="contained" color="primary" sx={{
                            fontSize: "16px",
                            backgroundColor: '#007bff',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#0056b3',
                            },
                        }}>
                            Back
                        </Button>
                    </Link>
                </Box>
                <form onSubmit={handleSaveChanges}>
                    {/* Question Text */}
                    <TextField
                        label="Question Text"
                        variant="outlined"
                        fullWidth
                        value={question?.questionText}
                        onChange={(e) => setQuestion({ ...question, questionText: e.target.value })}
                    />

                    {/* Category Selection */}
                    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            label="Category"
                            value={question?.categoryId}
                            onChange={(e) => setQuestion({ ...question, categoryId: e.target.value })}
                        >
                            {categories?.map((category) => (
                                <MenuItem key={category?._id} value={category?._id}>
                                    {category?.category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* Options */}
                    <TextField
                        label="Option 1"
                        variant="outlined"
                        fullWidth
                        value={question?.options[0]}
                        onChange={(e) =>
                            setQuestion({
                                ...question,
                                options: [...question?.options?.slice(0, 0), e.target.value, ...question?.options?.slice(1)],
                            })
                        }
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        label="Option 2"
                        variant="outlined"
                        fullWidth
                        value={question?.options[1]}
                        onChange={(e) =>
                            setQuestion({
                                ...question,
                                options: [...question?.options?.slice(0, 1), e.target.value, ...question?.options?.slice(2)],
                            })
                        }
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        label="Option 3"
                        variant="outlined"
                        fullWidth
                        value={question?.options[2]}
                        onChange={(e) =>
                            setQuestion({
                                ...question,
                                options: [...question?.options?.slice(0, 2), e.target.value, ...question?.options?.slice(3)],
                            })
                        }
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        label="Option 4"
                        variant="outlined"
                        fullWidth
                        value={question?.options[3]}
                        onChange={(e) =>
                            setQuestion({
                                ...question,
                                options: [...question?.options?.slice(0, 3), e.target.value],
                            })
                        }
                        sx={{ mt: 2 }}
                    />

                    {/* Correct Answer Selection */}
                    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                        <InputLabel>Correct Answer</InputLabel>
                        <Select
                            label="Correct Answer"
                            // value={question.correctAnswer}
                            value={question?.correctAnswer}
                            onChange={(e) =>
                                setQuestion({ ...question, correctAnswer: e.target.value })
                            }
                        >
                            {question.options?.map((option, index) => (
                                <MenuItem key={index} value={`option${index + 1}`}>
                                    {`Option ${index + 1}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </form>
                {/* Save Changes Button  */}
                <Box mt={4}>
                    <Button type="submit" color="secondary" variant="contained" sx={{
                        fontSize: "16px"
                    }} onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Box>
            </Box>

        </>
    );
};

export default EditQuestion;
