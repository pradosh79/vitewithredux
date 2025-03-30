import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axios";
import { toast } from "react-toastify";

const initialState = {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    loadingType: null, // Can be: 'login' | 'register' | 'verifyOtp'
};

export const registerCrud = createAsyncThunk(
    "auth/register",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/create/user`, formData);
            const result = response.data;
            localStorage.setItem("user_token", result.token);
            localStorage.setItem("user_id", result.user.id);
            localStorage.setItem("name", result.user.name);
            localStorage.setItem("email", result.user.email);
            return result;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Registration failed" });
        }
    }
);

export const logInCrud = createAsyncThunk(
    "auth/login",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/login/user`, formData);
            const result = response.data;
            localStorage.setItem("user_token", result.token);
            localStorage.setItem("user_id", result.user.id);
            localStorage.setItem("name", result.user.name);
            localStorage.setItem("email", result.user.email);
            return result;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Login failed" });
        }
    }
);

export const verifyOtpCrud = createAsyncThunk(
    "auth/verifyOtp",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`verify-otp`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "OTP verification failed" });
        }
    }
);

export const profileDas = createAsyncThunk("profile", async (id) => {
    let response = await axiosInstance.get(`/user/dashboard`);
    let result = response?.data;
    return result;
  });

export const UpdatePass = createAsyncThunk(
    "updatePass",
    async (formData, { rejectWithValue }) => {
      try {
        let response = await AxiosInstance.post(`/update/password`, formData);
        let result = response?.data;
  
        return result;
      } catch (error) {
        return rejectWithValue(
          error.response?.data || { message: "Password update failed" }
        );
      }
    }
  );
export const authSlice = createSlice({
    name: "Authentication",
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem("user_token");
            localStorage.removeItem("user_id");
            localStorage.removeItem("name");
            localStorage.removeItem("email");
            state.isAuthenticated = false;
            state.user = null;
            toast.success("Logout Successful");
        },
        check_token: (state) => {
            const token = localStorage.getItem("user_token");
            if (token) {
                state.isAuthenticated = true;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerCrud.pending, (state) => {
                state.isLoading = true;
                state.loadingType = "register";
            })
            .addCase(registerCrud.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.loadingType = null;
                state.user = payload?.user;
                //navigate("/auth/otp");
                toast.success("Registration Successful!");
            })
            .addCase(registerCrud.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.loadingType = null;
                toast.error(payload?.message || "Registration Failed");
            })

            // Login
            .addCase(logInCrud.pending, (state) => {
                state.isLoading = true;
                state.loadingType = "login";
            })
            .addCase(logInCrud.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.loadingType = null;
                state.isAuthenticated = true;
                state.user = payload?.user;
                toast.success("Login Successful!");
            })
            .addCase(logInCrud.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.loadingType = null;
                toast.error(payload?.message || "Login Failed");
            })

            // Verify OTP
            .addCase(verifyOtpCrud.pending, (state) => {
                state.isLoading = true;
                state.loadingType = "verifyOtp";
            })
            .addCase(verifyOtpCrud.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.loadingType = null;
                state.email = payload?.email;
                toast.success("OTP Verified Successfully!");
            })
            .addCase(verifyOtpCrud.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.loadingType = null;
                toast.error(payload?.message || "OTP Verification Failed");
            })

            //UpdatePass
            .addCase(UpdatePass.fulfilled, () => {
                toast.success("Password Updated Successfully!");
              })
              .addCase(UpdatePass.rejected, (_, { payload }) => {
                toast.error(payload?.message || "Password Update Failed");
              })
              //profileDashboard
            .addCase(profileDas.fulfilled, (state, { payload }) => {
                state.dashboardData = payload;
                toast.success("Password Updated Successfully!");
              })
              .addCase(profileDas.rejected, (_, { payload }) => {
                toast.error(payload?.message || "Password Update Failed");
              });
    },
});

export const { logout, check_token } = authSlice.actions;
export default authSlice.reducer;
