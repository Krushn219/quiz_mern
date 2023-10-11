/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Box, Button, MenuItem, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import axios from "axios"
import FormData from "form-data";
import { Link, useNavigate } from "react-router-dom";


const NewSubCategory = ({base_url}) => {
    const navigate = useNavigate();
    const [subCategoryImage, setCategoryImage] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [categories, setCategories] = useState([]);


    const handleFormSubmit = async (values, { resetForm }) => {
        try {
            // Create a FormData object
            const formData = new FormData();

            // Append the fields to the FormData object
            formData.append("subCategory_name", values?.subCategoryName);
            formData.append("category", values?.category);
            formData.append("description", values?.description);

            // Append the image file to the FormData object
            formData.append("image", subCategoryImage);

            // Make a POST request to your API endpoint with the requestData
            const response = await axios.post(
                `${base_url}api/v1/subcategory/create`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 201) {
                setIsSubmitted(true);
                resetForm();
            } else {
                console.error("Failed to create category");
            }
            // Redirect to the category page
            navigate('/subcategory');
        } catch (error) {
            console.error("An error occurred", error);
        }
    };

    useEffect(() => {
        axios.get(`${base_url}api/v1/category/all`)
            .then((response) => {
                setCategories(response?.data?.categories);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, []);


    return (

        <>
            <Box m="20px">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>

                    <Header title="CREATE SUB-CATEGORY" subtitle="Create a New SubCategory" />
                    <Link to="/subcategory">
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

                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={checkoutSchema}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        setFieldValue
                    }) => (
                        <>
                            <form onSubmit={handleSubmit}>
                                <Box
                                    display="grid"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                >
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="SubCategory Name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values?.subCategoryName} 
                                        name="subCategoryName" 
                                        error={!!touched.subCategoryName && !!errors.subCategoryName} 
                                        helperText={touched.subCategoryName && errors.subCategoryName} 
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Description"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values?.description}
                                        name="description"
                                        error={!!touched.description && !!errors.description}
                                        helperText={touched.description && errors.description}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <input
                                        type="file"
                                        id="subCategoryImage" // Change the id to "subCategoryImage"
                                        name="subCategoryImage" // Change the name to "subCategoryImage"
                                        accept="image/*"
                                        onChange={(event) => {
                                            const selectedFile = event.target.files[0];
                                            setCategoryImage(selectedFile);
                                            // Update the hidden field with the selected image
                                            setFieldValue("subCategoryImage", selectedFile); // Change to "subCategoryImage"
                                            // Get the selected file name
                                            setSelectedFileName(selectedFile ? selectedFile.name : '');
                                        }}
                                        style={{
                                            border: "solid 1px #d8d8d8",
                                            marginTop: '10px',
                                            backgroundColor: '#f2f2f2',
                                            color: '#333',
                                            padding: "40px 50px",
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        select
                                        label="Category"
                                        value={values?.category}
                                        onChange={handleChange}
                                        name="category"
                                        error={!!touched.category && !!errors.category}
                                        helperText={touched?.category && errors.category}
                                        sx={{ gridColumn: "span 2" }}
                                    >
                                        {categories?.map((category) => (
                                            <MenuItem key={category?._id} value={category?._id}>
                                                {category?.category}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                                <Box display="flex" justifyContent="end" mt="20px">
                                    <Button type="submit" color="secondary" variant="contained" sx={{
                                        fontSize: "16px"
                                    }}>
                                        Create SubCategory
                                    </Button>
                                </Box>
                            </form>
                        </>
                    )}
                </Formik>

            </Box>
        </>
    );
};

const checkoutSchema = yup.object().shape({
    subCategoryName: yup.string().required("required"), // Updated to subCategoryName
    category: yup.string().required("required"),
    description: yup.string().required("required"),
    subCategoryImage: yup.mixed().required("SubCategory image is required"), // Updated to subCategoryImage
});

const initialValues = {
    subCategoryName: "",
    category: "",
    description: "",
    subCategoryImage: null,
};

export default NewSubCategory;
