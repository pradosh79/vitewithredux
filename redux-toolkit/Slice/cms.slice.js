import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axios";
import { toast } from "react-toastify"; 

const initialState = {
    dashboardData: [],
    editData: [],
}


export const dashboard = createAsyncThunk("dash", async (formData) => {
    let response = await axiosInstance.get(`/get/product`);
    let result = response?.data;
    return result;
  });


export const productCreateCrud = createAsyncThunk(
    "product-create",
    async (formData, { rejectWithValue }) => {
        try {
            let response = await axiosInstance.post(`user/create/product`, formData);
            let result = response?.data;
            return result;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "product-create failed" }
            );
        }
    }
);

export const productListCrud = createAsyncThunk(
    "product-List",
    async (formData, { rejectWithValue }) => {
        try {
            let response = await axiosInstance.get(`get/product`, formData);
            let result = response?.data;
            console.log(response);
            //return result;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "product-create failed" }
            );
        }
    }
);

export const deleteProduct = createAsyncThunk("delete", async (id) => {
    let response = await axiosInstance.delete(`/delete/product/${id}`);
    let result = response?.data;
    return result;
  });
  
  export const edit = createAsyncThunk("edit", async (id) => {
    let response = await axiosInstance.get(`/get/product/${id}`);
    let result = response?.data;
    return result;
  });
  
  export const updateProduct = createAsyncThunk(
    "cms/updateProduct",
    async ({ id, dataEdit }) => {
      const response = await axiosInstance.put(`/update/product/${id}`, dataEdit);
      return response.data;
    }
  );




export const cmsSlice = createSlice({
    name: "cms",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // dashboard
            .addCase(dashboard.pending, (state, { payload }) => {
                state.dashboardData = payload;
                toast.success("product-create Pending");
            })
            .addCase(dashboard.fulfilled, (state, { payload }) => {
                state.dashboardData = payload.product;
                toast.success("product-create Successful!");
            })
            .addCase(dashboard.rejected, (_, { payload }) => {
                toast.error(payload?.message || "product-create Failed");
            })

            // create product
            .addCase(productCreateCrud.pending, (state, { payload }) => {
                state.product = payload?.user;
                toast.success("product-create Pending");
            })
            .addCase(productCreateCrud.fulfilled, (state, { payload }) => {
                state.product = payload?.user;
                toast.success("product-create Successful!");
            })
            .addCase(productCreateCrud.rejected, (_, { payload }) => {
                toast.error(payload?.message || "product-create Failed");
            })

            .addCase(edit.pending, (state, { payload }) => {})

            .addCase(edit.fulfilled, (state, { payload }) => {
              state.editData = payload.product;
            })
            .addCase(edit.rejected, (state, { payload }) => {})
      
            .addCase(deleteProduct.pending, (state, { payload }) => {})
      
            .addCase(deleteProduct.fulfilled, (state, { payload }) => {
              if (payload.status === true) {
                toast(payload.message);
              }
            })
            .addCase(deleteProduct.rejected, (state, { payload }) => {})
      
            .addCase(updateProduct.pending, (state, { payload }) => {})
      
            .addCase(updateProduct.fulfilled, (state, { payload }) => {
              if (payload.status === true) {
                toast(payload.message);
              }
            })
            .addCase(updateProduct.rejected, (state, { payload }) => {});            
            
    },
});


//export default cmsSlice.reducer;
export const {} = cmsSlice.reducer;