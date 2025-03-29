import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"; // For React Router
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
} from "@mui/material";
import { edit, updateProduct } from "../../../../redux-toolkit/Slice/cms.slice";

const schema = yup.object().shape({
    name: yup.string().required("Product name is required"),
    price: yup
        .number()
        .typeError("Price must be a number")
        .positive("Price must be positive")
        .required("Price is required"),
    description: yup.string().required("Description is required"),
    category: yup.string().required("Category is required"),
});

export default function Update() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const { editData } = useSelector((state) => state.cms);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });


    useEffect(() => {
        if (id) {
            dispatch(edit(id));
        }
    }, [dispatch, id]);


    useEffect(() => {
        if (editData) {
            setValue("category", editData.category);
            setValue("description", editData.description);
            setValue("name", editData.name);
            setValue("price", editData.price);
        }
    }, [editData, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);


        let dataEdit = {
            name: data.name,
            price: data.price,
            description: data.description,
            category: data.category,
        };

        try {
            if (id) {

                await dispatch(updateProduct({ id, dataEdit: dataEdit }));
            }
        } catch (error) {
            console.error("Product update failed", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
                <Typography variant="h4" gutterBottom>
                    {id ? "Edit Product" : "Create Product"}
                </Typography>
                <Typography variant="body1" textAlign="center" mb={2}>
                    {id ? "Edit your product details below." : "Create your product list by providing details below."}
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} width="100%">
                    <TextField
                        fullWidth
                        label="Product Name"
                        {...register("name")}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        {...register("price")}
                        error={!!errors.price}
                        helperText={errors.price?.message}
                        margin="normal"
                        variant="outlined"
                        type="number"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        {...register("description")}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Category"
                        {...register("category")}
                        error={!!errors.category}
                        helperText={errors.category?.message}
                        margin="normal"
                        variant="outlined"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : id ? "Update Product" : "Create Product"}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
