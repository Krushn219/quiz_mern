/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, TextField, Button, Card, CardMedia, Input } from '@mui/material';

const EditCategory = ({base_url}) => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState({
        category: '',
        description: '',
        image: '',
        newImage: null,
    });

    useEffect(() => {
        // Fetch category details based on categoryId
        axios.get(`${base_url}api/v1/category/single/${categoryId}`)
            .then((response) => {
                const absoluteImageUrl = `${base_url}${response?.data?.category?.image.replace(/\\/g, '/')}`;
                setCategory({
                    category: response?.data?.category?.category,
                    description: response?.data?.category?.description,
                    image: absoluteImageUrl,
                    newImage: null,
                });
            })
            .catch((error) => {
                console.error('Error fetching category details:', error);
            });
    }, [categoryId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCategory({
            ...category,
            [name]: value,
        });
    };

    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0];
        setCategory({
            ...category,
            image: selectedImage,
        });
    };

    // const handleSaveChanges = async () => {
    //     try {
    //         const formData = new FormData();
    //         formData.append('category', category.category);
    //         formData.append('description', category.description);
    //         formData.append('image', category.image);

    //         // Send a PUT request with the formData
    //         const response = await axios.put(`${base_url}api/v1/category/${categoryId}`, formData);

    //         // Handle the response and provide feedback to the user

    //         // Redirect to the category page
    //         navigate('/form');
    //     } catch (error) {
    //         console.error('Error updating category data:', error);
    //     }
    // };

    const handleSaveChanges = () => {

        const formData = new FormData();
        formData.append('category', category?.category);
        formData.append('description', category?.description);
        formData.append('image', category?.image);


        // Send a PUT request with the formData
        axios.put(`${base_url}api/v1/category/${categoryId}`, formData)
            .then((response) => {
                // Redirect to the category page
                navigate('/');
            })
            .catch((error) => {
                console.error('Error updating category data:', error);
            });
    };

    return (
        <>
            <Box p={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h2" gutterBottom mb={4}>
                        Edit Category
                    </Typography>
                    <Link to="/">
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

                <Card>
                    <CardMedia
                        component="img"
                        alt={category?.category}
                        height="140"
                        src={category?.image}
                        title={category?.category}
                        sx={{
                            width: '30%',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                            marginBottom: "20px",
                            backgroundColor: 'transparent',
                            backgroundImage: 'none !important'
                        }}
                    />
                </Card>
                <form onSubmit={handleSaveChanges}>
                    <Input
                        type="file"
                        accept="image/*"
                        name="newImage"
                        onChange={handleImageChange}
                        sx={{ mb: "20px" }}
                        style={{
                            border: "solid 1px #d8d8d8",
                            marginTop: '10px',
                            backgroundColor: '#f2f2f2',
                            color: '#333',
                            padding: "40px 50px"
                        }}
                    />

                    <Box mb={2}> {/* Add margin-bottom for spacing */}
                        <Typography variant="subtitle1" mb={2} sx={{ fontSize: "18px" }}>Category Name</Typography>
                        <TextField
                            fullWidth
                            name="category"
                            variant="filled"
                            type="text"
                            value={category?.category}
                            onChange={handleInputChange}
                            sx={{ mb: 3 }}
                        />
                    </Box>

                    <Box mb={2}> {/* Add margin-bottom for spacing */}
                        <Typography variant="subtitle1" mb={2} sx={{ fontSize: "18px" }}>Description</Typography>
                        <TextField
                            fullWidth
                            name="description"
                            variant="filled"
                            type="text"
                            value={category?.description}
                            onChange={handleInputChange}
                            sx={{ mb: 3, fontSize: "16px" }}
                        />
                    </Box>

                </form>
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

export default EditCategory;
