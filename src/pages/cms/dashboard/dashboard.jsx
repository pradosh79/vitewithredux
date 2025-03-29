import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { dashboard, deleteProduct } from '../../../../redux-toolkit/Slice/cms.slice';

export default function Dashboard() {
  const dispatch = useDispatch();

  const dashboardData = useSelector((state) => state.cms.dashboardData); // ✅ already an array
  const [loadingProducts, setLoadingProducts] = useState({});

  useEffect(() => {
    dispatch(dashboard()); // ✅ runs once on mount
  }, []);

  const handleDelete = (productId) => {
    setLoadingProducts((prevState) => ({ ...prevState, [productId]: true }));

    dispatch(deleteProduct(productId))
      .unwrap()
      .then(() => {
        dispatch(dashboard());
      })
      .catch((error) => console.error("Error deleting product:", error))
      .finally(() => {
        setLoadingProducts((prevState) => ({
          ...prevState,
          [productId]: false,
        }));
      });
  };

  const columns = [
    { field: "name", headerName: "Product Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      flex: 1,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box display="flex" gap={2}>
          <Link to={`/cms/edit/${params.row._id}`} style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary">Edit</Button>
          </Link>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(params.row._id)}
            disabled={loadingProducts[params.row._id]}
          >
            {loadingProducts[params.row._id] ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Delete"
            )}
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Paper sx={{ p: 3, width: "100%", height: 500 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <DataGrid
        rows={dashboardData || []} // ✅ no chaining
        columns={columns}
        pageSizeOptions={[5, 10, 25, 100]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{ border: 0 }}
        getRowId={(row) => row._id}
      />
    </Paper>
  );
}
