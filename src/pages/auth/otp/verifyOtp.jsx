import { verifyOtpCrud } from '../../../../redux-toolkit/Slice/auth.slice';
import { useNavigate } from 'react-router-dom';
import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Grid,
} from "@mui/material";

export default function VerifyOtp() {
    const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const email =
    useSelector((state) => state.Auth?.email) ||
    localStorage.getItem("email") ||
    "";

  const { handleSubmit, setValue, getValues } = useForm({
    defaultValues: { otp: "" },
  });
  const otpRefs = useRef([]);

  const handleOTPChange = (e, index) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 1) value = value.charAt(0);
    otpRefs.current[index].value = value;

    if (value && index < 3) otpRefs.current[index + 1]?.focus();
    if (!value && index > 0) otpRefs.current[index - 1]?.focus();

    const otpArray = otpRefs.current.map((input) => input.value).join("");
    setValue("otp", otpArray);
  };

  const onSubmit = async (data) => {
    const otp = getValues("otp");

    if (!email) {
      console.error("Email is not available!");
      return;
    }

    if (otp.length !== 4) {
      console.error("OTP must be 4 digits!");
      return;
    }

    setLoading(true);
    try {
      const payload = { email, otp };
      const response = await dispatch(verifyOtpCrud(payload)).unwrap();

      if (response) {
        navigate("/");
      }
    } catch (error) {
      console.error("Verification failed", error);
    } finally {
      setLoading(false);
    }
  };
    return (
        <>
            {/* <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Grid container spacing={2} style={{ marginTop: "50px" }}>
                    <Grid item xs={12} md={6} style={{ marginTop: "100px" }}>
                        <Paper elevation={3} sx={{ padding: 3 }} style={{ maxWidth: "450px", margin: "0 auto" }}>

                            <form onSubmit={handleSubmit(onhandelSubmit)}>
                                <TextField
                                    {...register("email", {
                                        required: "email is required",
                                        pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                    })}
                                    label="email"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                                <TextField
                                    {...register("verify_otp", {
                                        required: "verify_otp is required",
                                    })}
                                    label="verify_otp"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.verify_otp}
                                    helperText={errors.verify_otp?.message}
                                />
                                <Button variant="contained" color="primary" fullWidth size="large" type="submit" sx={{ marginTop: 2 }}>
                                    Submit
                                </Button>
                            </form>
                            {successMessage && (
                                <Typography variant="body1" color="success" sx={{ marginTop: 2 }}>
                                    {successMessage}
                                </Typography>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </div> */}
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Card sx={{ width: "100%", padding: 3, boxShadow: 3, borderRadius: 2 }}>
          <CardHeader
            title="Enter Verification Code"
            titleTypographyProps={{
              variant: "h5",
              textAlign: "center",
              fontWeight: "bold",
            }}
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              py: 2,
              borderRadius: "8px 8px 0 0",
            }}
          />
          <CardContent>
            <Typography variant="body1" textAlign="center" mb={2}>
              Enter the 4-digit code sent to{" "}
              <strong>{email || "your email"}</strong>.
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              display="flex"
              justifyContent="center"
            >
              <Grid container spacing={2} justifyContent="center">
                {[...Array(4)].map((_, index) => (
                  <Grid item key={index} xs={2}>
                    <TextField
                      inputRef={(el) => (otpRefs.current[index] = el)}
                      inputProps={{
                        maxLength: 1,
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        style: { textAlign: "center", fontSize: "1.5rem" },
                      }}
                      variant="outlined"
                      size="small"
                      onChange={(e) => handleOTPChange(e, index)}
                      sx={{ width: "100%", textAlign: "center" }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
              onClick={handleSubmit(onSubmit)}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Verify"
              )}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
        </>
    )
}
