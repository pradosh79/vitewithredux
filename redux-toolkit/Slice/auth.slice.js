import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axios";
import { toast } from "react-toastify"; 

const initialState = {}

export const registerCrud = createAsyncThunk(
    "register",
    async (formData, { rejectWithValue }) => {
        try {
            let response = await axiosInstance.post(`/create/user`, formData);
            let result = response?.data;
            localStorage.setItem("user_token", result.token);
            localStorage.setItem("user_id", result.user.id);
            localStorage.setItem("name", result.user.name);
            localStorage.setItem("email", result.user.email);
      
            return result;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Registration failed" }
            );
        }
    }
);

export const logInCrud = createAsyncThunk(
    "login",  
    async (formData, { rejectWithValue }) => {
        try {
            let response = await axiosInstance.post(`/login/user`, formData);
            let result = response?.data;
            localStorage.setItem("user_token", result.token);
            localStorage.setItem("user_id", result.user.id);
            localStorage.setItem("name", result.user.name);
            localStorage.setItem("email", result.user.email);
      
            return result;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Login failed" }
            );
        }
    }
);

export const verifyOtpCrud = createAsyncThunk(
    "verifyOtp",  
    async (formData, { rejectWithValue }) => {
        try {
            let response = await axiosInstance.post(`verify-otp`, formData);
            let result = response?.data;
            return result;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "verifyOtp failed" }
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
          let token = localStorage.getItem("user_token");
          if (token) {
            state.isAuthenticated = true;
          }
        },
      },
    extraReducers: (builder) => {
        builder
            // Register 
            .addCase(registerCrud.pending, (state, { payload }) => {
                state.user = payload?.user;
                toast.success("Registration Pending");
            })
            .addCase(registerCrud.fulfilled, (state, { payload }) => {
                state.user = payload?.user;
                toast.success("Registration Successful!");
            })
            .addCase(registerCrud.rejected, (_, { payload }) => {
                toast.error(payload?.message || "Registration Failed");
            })
            
            // Login 
            .addCase(logInCrud.pending, (state) => {
                state.isLoading = true;
                toast.info("Login Pending...");
            })
            .addCase(logInCrud.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = payload?.user;
                toast.success("Login Successful!");
            })
            .addCase(logInCrud.rejected, (state, { payload }) => {
                state.isLoading = false;
                toast.error(payload?.message || "Login Failed");
            })

            // verifyOtp 
            .addCase(verifyOtpCrud.pending, (state) => {
                state.isLoading = true;
                toast.info("verifyOtp Pending...");
            })
            .addCase(verifyOtpCrud.fulfilled, (state, { payload }) => {
                console.log(payload,'frm auth.slice.js');
                state.isLoading = false;
                state.email = payload?.email;
                toast.success("verifyOtp Successful!");
            })
            .addCase(verifyOtpCrud.rejected, (state, { payload }) => {
                state.isLoading = false;
                toast.error(payload?.message || "verifyOtp Failed");
            });
    },
});

export const { logout, check_token } = authSlice.actions;
export default authSlice.reducer;
