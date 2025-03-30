import React, { useEffect } from "react";
import { profileDas } from "../../../../redux-toolkit/Slice/auth.slice";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Profile() {
  const dispatch = useDispatch();
  const { dashboardData } = useSelector((state) => state.Auth);

  useEffect(() => {
    dispatch(profileDas());
  }, [dispatch]);

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar sx={{ width: 80, height: 80 }}>
            <AccountCircleIcon fontSize="large" />
          </Avatar>
        </Box>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            {dashboardData?.data?.name || "User Name"}
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary">
            {dashboardData?.data?.email || "user@example.com"}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
