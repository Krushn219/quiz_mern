import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Paper,
    IconButton,
    Grid,
    Button,
    MenuItem,
    Select,
    InputBase,
    useTheme,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { tokens } from '../../theme';
import SearchIcon from "@mui/icons-material/Search";


const AllQuestions = ({ base_url }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [questions, setQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch paginated questions when the component mounts or when currentPage changes
        axios
            .get(`${base_url}api/v1/question`, {
                params: {
                    page: currentPage,
                    limit: itemsPerPage,
                },
            })
            .then((response) => {
                setQuestions(response?.data?.questions);
                // Calculate total pages based on the total number of categories
                const totalCount = response?.data?.count || 0;
                setTotalPages(Math.ceil(totalCount / itemsPerPage));
            })
            .catch((error) => {
                console.error('Error fetching questions:', error);
            });
    }, [currentPage, itemsPerPage, searchQuery]);

    const handleEditQuestion = (questionId) => {
        // Implement edit category logic
        navigate(`/edit-question/${questionId}`);
    };

    const handleDeleteQuestion = async (questionId) => {
        try {
            // Send a DELETE request to delete the question
            await axios.delete(`${base_url}api/v1/question/${questionId}`);

            // Remove the deleted question from the state
            setQuestions((prevQuestions) =>
                prevQuestions?.filter((question) => question?._id !== questionId)
            );
            navigate("/question");
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleItemsPerPageChange = (event) => {
        const newItemsPerPage = event.target.value;
        setItemsPerPage(newItemsPerPage);
        // Recalculate total pages when items per page changes
        setTotalPages(Math.ceil(questions.length / newItemsPerPage));
        setCurrentPage(1); 
    };

    const handleSearch = (e) => {
        const inputValue = e.target.value.toLowerCase();

        const filteredData = questions.filter((item) =>
            // item.name.toLowerCase().includes(searchQuery.toLowerCase())
            item.question.toLowerCase().startsWith(inputValue)

        );
        // Update the filtered data state
        setFilteredData(filteredData);

        // Update the searchQuery state
        setSearchQuery(inputValue);
    };


    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" gutterBottom sx={{ fontSize: '24px' }}>
                    All Questions
                </Typography>
                {/* SEARCH BAR */}
                <Box
                    display="flex"
                    backgroundColor={colors.primary[400]}
                    borderRadius="3px"
                >

                    <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" value={searchQuery} onChange={handleSearch} />
                    <IconButton type="button" sx={{ p: 1 }}>
                        <SearchIcon />
                    </IconButton>
                </Box>
                <Link to="/new-question">
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            fontSize: '16px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#0056b3',
                            },
                        }}
                    >
                        Create New
                    </Button>
                </Link>
            </Box>
            <Paper>
                <List>
                    <ListItem sx={{ border: '1px solid #e0e0e0', marginBottom: 2, background: "#3e4396" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <ListItemText primary="Question" />
                            </Grid>
                            <Grid item xs={2}>
                                <ListItemText primary="SubCategory" />
                            </Grid>
                            <Grid item xs={1}>
                                <ListItemText primary="Ans1" />
                            </Grid>
                            <Grid item xs={1}>
                                <ListItemText primary="Ans2" />
                            </Grid>
                            <Grid item xs={1}>
                                <ListItemText primary="Ans3" />
                            </Grid>
                            <Grid item xs={1}>
                                <ListItemText primary="Ans4" />
                            </Grid>
                            <Grid item xs={2}>
                                <ListItemText primary="Correct Answer" />
                            </Grid>
                            <Grid item xs={1}>
                                <ListItemText primary="Actions" />
                            </Grid>
                        </Grid>
                    </ListItem>
                    {searchQuery ? (
                        filteredData?.map((question) => (
                            <ListItem key={question._id} sx={{ border: '1px solid #e0e0e0', marginBottom: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <ListItemText primary={question?.question} />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <ListItemText primary={question?.subcategory?.subCategory_name} />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <ListItemText primary={question?.options[0]} />
                                    </Grid>
                                    {/* Add ListItemText components for other columns here */}
                                    <Grid item xs={1}>
                                        <ListItemText primary={question?.options[1]} />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <ListItemText primary={question?.options[2]} />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <ListItemText primary={question?.options[3]} />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <ListItemText primary={question?.answer} />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton
                                            edge="end"
                                            aria-label="edit"
                                            onClick={() => handleEditQuestion(question?._id)}
                                            sx={{
                                                backgroundColor: '#4CAF50',
                                                color: 'white',
                                                marginRight: '8px',
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => handleDeleteQuestion(question?._id)}
                                            sx={{
                                                backgroundColor: '#F44336',
                                                color: 'white',
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        ))
                    ):(
                        questions?.map((question) => (
                            <ListItem key={question._id} sx={{ border: '1px solid #e0e0e0', marginBottom: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <ListItemText primary={question?.question} />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <ListItemText primary={question?.subcategory?.subCategory_name} />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <ListItemText primary={question?.options[0]} />
                                    </Grid>
                                    {/* Add ListItemText components for other columns here */}
                                    <Grid item xs={1}>
                                        <ListItemText primary={question?.options[1]} />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <ListItemText primary={question?.options[2]} />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <ListItemText primary={question?.options[3]} />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <ListItemText primary={question?.answer} />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton
                                            edge="end"
                                            aria-label="edit"
                                            onClick={() => handleEditQuestion(question?._id)}
                                            sx={{
                                                backgroundColor: '#4CAF50',
                                                color: 'white',
                                                marginRight: '8px',
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => handleDeleteQuestion(question?._id)}
                                            sx={{
                                                backgroundColor: '#F44336',
                                                color: 'white',
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        ))
                    )}
                    
                </List>
            </Paper>
            <Box mt={2} display="flex" justifyContent="center" backgroundColor="#3e4396" border={"1px solid #e0e0e0"} p={1.5} alignItems="center" >
                {/* Pagination controls */}
                <Button
                    variant="contained"
                    color="primary"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous Page
                </Button>
                <Select
                    labelId="itemsPerPage-label"
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    sx={{ color: 'white' }} // Style the dropdown text color
                >
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                </Select>
                <Typography variant="body1" sx={{ margin: '0 1rem' }}>
                    Page {currentPage} of {totalPages}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next Page
                </Button>
            </Box>
        </Box>
    );
};

export default AllQuestions;
