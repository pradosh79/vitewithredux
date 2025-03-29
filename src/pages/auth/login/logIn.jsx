import React, { useState } from 'react'
import { Grid, Box, Paper, Typography, TextField, Button, Link } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { logInCrud } from '../../../../redux-toolkit/Slice/auth.slice';
import { useNavigate } from 'react-router-dom';

export default function LogIn() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const onSubmit = async (Data) => {
        setLoading(true);
        try {
                const { name, email, password } = Data;

                const formdata = new URLSearchParams();

                formdata.append("email", email);
                formdata.append("password", password);

                await new Promise((resolve) => setTimeout(resolve, 1500));
                const response=await  dispatch(logInCrud(formdata)).unwrap();


                ///console.log(response,'response');
                if (response?.user.id) {
                    localStorage.setItem("user_id", response.user.id);
                    localStorage.setItem("user_token", response.token);
                    navigate ("/cms/dashboard"); // Redirect after successful login
                }
        } catch (error) {
            console.error("Login failed", error);
          } finally {
            setLoading(false);
          }
    };

    return (
        <>

            <Grid container style={{ marginTop: "100px" }}>
                <Grid item xs={6} md={0}>
                    <Box
                        sx={{
                            height: "98vh",
                            width: "57vw",
                            backgroundImage: "url(https://pagedone.io/asset/uploads/1696488602.png)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: "16px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "white",
                            padding: 3,
                            marginTop: "17vh",
                            paddingRight: "-77vh",
                        }}
                    />
                </Grid>

                <Grid item xs={6} md={6} style={{ marginTop: "100px" }}>
                    <Paper elevation={3} sx={{ padding: 3 }} style={{ maxWidth: "450px", margin: "0 auto" }}>
                        <Typography variant="h4" gutterBottom>
                            Login Page
                        </Typography>
                        <Typography variant="body1" textAlign="center" mb={2}>
                            Login using your registered email and password.
                        </Typography>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>


                            </Grid>
                            <TextField
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                        message: "Invalid email address",
                                    },
                                })}
                                label="Email Address"
                                fullWidth
                                margin="normal"
                                error={!!errors.email}
                                helperText={errors.email ? errors.email.message : ''}
                            />

                            <TextField
                                {...register("password", {
                                    required: "Password is required",
                                    pattern: {
                                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                        message: "Password must be at least 8 characters long and include letters, numbers, and special characters",
                                    },
                                })}
                                label="Password"
                                type="password"
                                fullWidth
                                margin="normal"
                                error={!!errors.password}
                                helperText={errors.password ? errors.password.message : ''}
                            />

                                <Typography variant="body2" align="center">
                                   Don't have an account? <Link href="/auth/signup">Register</Link>
                                </Typography>

                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                type="submit"
                                sx={{ marginTop: 2 }}
                            >
                                Submit
                            </Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>

        </>
    )
}
