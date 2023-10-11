/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Avatar, Button, Grid, MenuItem, Select, useTheme, InputBase } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import "./category.css"
import { Link, useNavigate } from 'react-router-dom';
import { tokens } from '../../theme';
import SearchIcon from "@mui/icons-material/Search";



const Form = ({ base_url }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const apiUrl = `${base_url}api/v1/category/all`

  useEffect(() => {
    axios.get(apiUrl, {
      params: {
        page: currentPage,
        limit: itemsPerPage,
      }
    })
      .then((response) => {
        // Category 'image' with the filename
        const categoriesWithImageUrls = response?.data?.categories?.map((category) => ({
          ...category,
          image: `${base_url}${category?.image?.replace(/\\/g, '/')}`,
        }));
        setCategories(categoriesWithImageUrls);

        // Calculate total pages based on the total number of categories
        const totalCount = response?.data?.count || 0;
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, [apiUrl, itemsPerPage, currentPage]);

  const handleDeleteCategory = (categoryId) => {
    axios.delete(`${base_url}api/v1/category/${categoryId}`)
      .then((response) => {
        // Update the state by removing the deleted category
        setCategories((prevCategories) => prevCategories?.filter((category) => category?._id !== categoryId));
      })
      .catch((error) => {
        console.error('Error deleting category:', error);
      });
  };

  const handleEditCategory = (categoryId) => {
    // Implement edit category logic here
    navigate(`/edit-category/${categoryId}`);
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
    setTotalPages(Math.ceil(categories.length / newItemsPerPage));
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  const handleSearch = (e) => {
    const inputValue = e.target.value.toLowerCase();

    const filteredData = categories.filter((item) =>
      // item.name.toLowerCase().includes(searchQuery.toLowerCase())
      item.category.toLowerCase().startsWith(inputValue)
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
          All Categories
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

        <Link to="/new-category">
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
          <ListItem className="category-list-item category-header" sx={{ border: '1px solid #e0e0e0', marginBottom: 2, background: "#3e4396" }}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Typography variant="subtitle1">Category Image</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle1">Name</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle1">Description</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="srOnly">Actions</Typography>
              </Grid>
            </Grid>
          </ListItem>
          {searchQuery ? (
            filteredData?.map((category) => (

              <ListItem key={category?._id} className="category-list-item" sx={{ marginBottom: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <Avatar src={category?.image} alt={category?.category} />
                  </Grid>
                  <Grid item xs={4}>
                    <ListItemText primary={category?.category} />
                  </Grid>
                  <Grid item xs={4}>
                    <ListItemText primary={category?.description} />
                  </Grid>
                  <Grid item xs={2}>
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditCategory(category?._id)}
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
                        onClick={() => handleDeleteCategory(category?._id)}
                        sx={{
                          backgroundColor: '#F44336',
                          color: 'white',
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </Grid>
                </Grid>
              </ListItem>
            ))
          ) : (
            categories?.map((category) => (

              <ListItem key={category?._id} className="category-list-item" sx={{ marginBottom: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <Avatar src={category?.image} alt={category?.category} />
                  </Grid>
                  <Grid item xs={4}>
                    <ListItemText primary={category?.category} />
                  </Grid>
                  <Grid item xs={4}>
                    <ListItemText primary={category?.description} />
                  </Grid>
                  <Grid item xs={2}>
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditCategory(category?._id)}
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
                        onClick={() => handleDeleteCategory(category?._id)}
                        sx={{
                          backgroundColor: '#F44336',
                          color: 'white',
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
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
          sx={{ color: 'white' }} 
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

export default Form;
