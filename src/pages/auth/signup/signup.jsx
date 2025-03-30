import React,{ useState } from 'react'
import { Grid, Box, Paper, Typography, TextField, Button, Link, FormControlLabel, Checkbox } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { registerCrud } from '../../../../redux-toolkit/Slice/auth.slice';
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(3, "Password must be at least 3 characters")
      .required("Password is required"),
  });

export default function SignUp() {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema),
      });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [passwordType, setPasswordType] = useState("password");
    const onSubmit = async (Data) => {
      setLoading(true);
  
      const { name, email, password } = Data;
  
      const formdata = new URLSearchParams();
      formdata.append("name", name);
      formdata.append("email", email);
      formdata.append("password", password);
  
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate delay
        const response = await dispatch(registerCrud(formdata)).unwrap();
        if (response) {
          navigate("/auth/otp");
        }
      } catch (error) {
        console.error("Registration failed", error);
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
                            <Typography variant="h5" align="center" gutterBottom>
                                Create an Account
                            </Typography>
                            <Typography variant="body2" align="center">
                                Already have an account? <Link href="/">LogIn</Link>
                            </Typography>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            {...register("name", {
                                                required: "Name is required-test",
                                                pattern: {
                                                    value: /^[a-z ,.'-]+$/i,
                                                    message: "Invalid name",
                                                },
                                            })}
                                            label="Name"
                                            fullWidth
                                            margin="normal" 
                                            error={!!errors.name} 
                                            helperText={errors.name ? errors.name.message : ''}
                                        />
                                    </Grid>

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
                                    type={passwordType}
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.password} 
                                    helperText={errors.password ? errors.password.message : ''}
                                />
                               <FormControlLabel
                                                                       control={
                                                                         <Checkbox
                                                                           onClick={() =>
                                                                             setPasswordType((prev) =>
                                                                               prev === "password" ? "text" : "password"
                                                                             )
                                                                           }
                                                                         />
                                                                       }
                                                                       label="Show Password"
                                                                     />
                                
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
