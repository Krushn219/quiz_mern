
import React, { useState } from 'react';
import axios from 'axios';
import "./login.css"
import { Button, TextField } from '@mui/material';
import { Formik, Form } from "formik";
import * as yup from "yup";
import { useNavigate } from 'react-router-dom';

const Login = ({ base_url, setIsLoggedIn }) => {
    // const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate()

    const loginData = {
        email: '',
        password: '',
    };


    const handleSubmit = async (values) => {
        let obj = {
            email: values?.email,
            password: values?.password
        }


        try {
            const response = await axios.post(`${base_url}api/v1/auth/login`, obj);
            // setIsLoggedIn(true)

            // Check if the login was successful (you can customize this condition)
            if (response.data.success === true) {
                localStorage.setItem('token', response.data.token);
                setIsLoggedIn(true)
                // Redirect to the / page upon successful login
                navigate('/subcategory'); 
            }


        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="login-container">
                <h2>Login</h2>
                <Formik
                    onSubmit={handleSubmit}
                    initialValues={loginData}
                    validationSchema={checkoutSchema}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                    }) => (
                        <Form>
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                name="email"
                                className="input-field"
                                style={{ marginBottom: '25px' }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="password"
                                label="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                name="password"
                                className="input-field"
                                style={{ marginBottom: '25px' }}
                            />

                            <Button type="submit" color="secondary" variant="contained" sx={{
                                fontSize: "16px"
                            }}>
                                Login
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

const checkoutSchema = yup.object().shape({
    email: yup.string().required("required"),
    password: yup.string().required("required"),
});
const initialValues = {
    email: "",
    password: "",
};

export default Login;
