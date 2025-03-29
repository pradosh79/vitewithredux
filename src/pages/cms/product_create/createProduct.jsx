import { Navigate, useNavigate } from "react-router-dom";
import { Paper, Typography, TextField, Button, Box, Grid, CircularProgress} from '@mui/material';
import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { productCreateCrud } from "../../../../redux-toolkit/Slice/cms.slice";

export default function CreateProduct() {

  const { register, handleSubmit, formState: { errors }, watch,isPending } = useForm();
     
      const dispatch = useDispatch();
      const [loading, setLoading] = useState(false);
      
      const onSubmit = async (Data) => {
        setLoading(true);

        const {name,price,description,category} = Data;
    
        const formdata = new URLSearchParams();
        formdata.append("name", name);
        formdata.append("price", price);
        formdata.append("description", description);
        formdata.append("category", category);
        try {
            await dispatch(productCreateCrud(formdata));
            Navigate("/cms/dashboard");
        } catch (error) {
            console.error("Product creation failed", error);
        } finally {
            setLoading(false);
        }
      };


  return (
    <div>
      <Grid container spacing={2} style={{ height: "50vh" }}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ margin: "0 auto" }}
          style={{ marginTop: "100px" }}
        >
          <Paper elevation={3} sx={{ p: 3, width: 500, mx: "auto", mt: 5 }}>
  <Typography variant="h5" fontWeight="bold" gutterBottom>
    Create Product
  </Typography>
  <form onSubmit={handleSubmit(onSubmit)}>
    <TextField
      {...register("name", { required: "Name is required" })}
      label="Product Name"
      variant="outlined"
      margin="dense"
      fullWidth
      error={!!errors.name}
      helperText={errors.name?.message}
    />
    
    <TextField
      {...register("price", { required: "Price is required" })}
      label="Price"
      variant="outlined"
      margin="dense"
      fullWidth
      error={!!errors.price}
      helperText={errors.price?.message}
    />

    <TextField
      {...register("description", { required: "Description is required" })}
      label="Description"
      variant="outlined"
      margin="dense"
      fullWidth
      multiline
      rows={3}
      error={!!errors.description}
      helperText={errors.description?.message}
    />

    <TextField
      {...register("category", { required: "Category is required" })}
      label="Category"
      variant="outlined"
      margin="dense"
      fullWidth
      error={!!errors.category}
      helperText={errors.category?.message}
    />

<Button
      type="submit"
      variant="contained"
      color="primary"
      fullWidth
      sx={{ mt: 2 }}
      disabled={loading}
  >
      {loading ? <CircularProgress size={24} color="inherit" /> : "Create Product"}
  </Button>
  </form>
</Paper>

        </Grid>
      </Grid>
    </div>
  )
}
