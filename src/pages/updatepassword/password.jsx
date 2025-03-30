import  { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Container,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { UpdatePass } from "../../../redux-toolkit/Slice/auth.slice";

const schema = yup.object().shape({
  password: yup
    .string()
    .min(3, "Password must be at least 3 characters")
    .required("Password is required"),
});

export default function UpdatePassword() {
  const dispatch = useDispatch();
  const [passwordType, setPasswordType] = useState("password");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const user_id = localStorage.getItem("user_id");
      console.log(user_id, "user_id");
      let data1 = {
        user_id: user_id,
        password: data.password,
      };

      console.log(data1);
      dispatch(UpdatePass(data1));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          Update Password
        </Typography>
        <Typography variant="body1" textAlign="center" mb={2}>
          Enter your new password to update your account.
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} width="100%">
          <TextField
            fullWidth
            label="Password"
            {...register("password")}
            type={passwordType}
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="normal"
            variant="outlined"
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
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Register"
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
