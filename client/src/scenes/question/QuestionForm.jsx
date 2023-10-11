/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { TextField, Button, RadioGroup, FormControlLabel, Radio, FormLabel, Box, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import Header from '../../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./question.css"
import { useTheme } from '@mui/material/styles';


const QuestionForm = ({base_url}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [subcategories, setSubCategories] = useState([]);
    const [questionData, setQuestionData] = useState({
        question: '',
        options: ['', '', '', ''],
        answer: 'option1',
        subcategory: '',
    });

    theme.palette.primary.main = 'rgb(192,192,192)';

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setQuestionData({
            ...questionData,
            [name]: value,
        });
    };

    const handleOptionChange = (event, index) => {
        const updatedOptions = [...questionData?.options];
        updatedOptions[index] = event.target.value;
        const selectedOption = `option${index + 1}`;
        setQuestionData({
            ...questionData,
            options: updatedOptions,
            answer: selectedOption,
        });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Send a POST request to create a new question
            const response = await axios.post(`${base_url}api/v1/question/create`, questionData);

            // Check if the request was successful
            if (response.status === 200) {
                // Reset the form fields if needed
                setQuestionData({
                    question: '',
                    options: ['', '', '', ''],
                    answer: 'option1',
                    subcategory: ''
                });
            }
            navigate('/question');

        } catch (error) {
            // Handle errors, e.g., display an error message
            console.error('Error creating question:', error);
        }
    };

    useEffect(() => {
        // Fetch categories when the component mounts
        axios
            .get(`${base_url}api/v1/subcategory/all`)
            .then((response) => {
                setSubCategories(response?.data?.subCategories);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Header title="CREATE QUESTION" subtitle="Create a New Question" />
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
            <FormControl fullWidth>
                <InputLabel htmlFor="subcategory">SubCategory</InputLabel>
                <Select
                    id="subcategory"
                    name="subcategory"
                    value={questionData?.subcategory}
                    onChange={(event) => handleInputChange(event)} // Call handleInputChange here
                    required
                >
                    {subcategories?.map((subcategory) => (
                        <MenuItem key={subcategory?._id} value={subcategory?._id}>
                            {subcategory?.subCategory_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <form onSubmit={handleSubmit}>
                <TextField
                    name="question"
                    label="Question"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={questionData.question}
                    onChange={handleInputChange}
                    style={{
                        fontSize: '20px !important',
                        '&:focus': {
                            borderColor: theme.palette.primary.main, // Use the customized color
                        },
                    }}
                    required
                />
                <FormLabel component="legend" sx={{ fontSize: "20px" }}>Options</FormLabel>
                {questionData.options?.map((option, index) => (
                    <TextField
                        key={index}
                        name={`options[${index}]`}
                        label={`Option ${index + 1}`}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={option}
                        onChange={(event) => handleOptionChange(event, index)}
                        sx={{ fontSize: '20px !important' }}
                        required
                    />
                ))}
                <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">Correct Answer</FormLabel>
                    <RadioGroup
                        name="answer"
                        value={questionData.answer}
                        onChange={handleInputChange}
                    >
                        {questionData.options?.map((option, index) => (
                            <FormControlLabel
                                key={index}
                                value={`option${index + 1}`}
                                control={<Radio />}
                                label={`Option ${index + 1}`}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
                <Box display="flex" mt="20px">
                    <Button type="submit" color="secondary" variant="contained" sx={{
                        fontSize: "16px"
                    }} onClick={handleSubmit}>
                        Create Question
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default QuestionForm;


// *************************
// *********Un Used Code ***
// *************************

 {/* <Select
                    id="subcategory"
                    name="subcategory"
                    value={questionData.subcategory}
                    onChange={handleInputChange}
                    required
                >
                    {subcategories?.map((subcategory) => (
                        <MenuItem key={subcategory._id} value={subcategory._id}>
                            {subcategory.subCategory_name}
                        </MenuItem>
                    ))}
                </Select> */}
