import { lazy, Suspense, useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./layout/header/header";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LogIn from './pages/auth/login/logIn'
import SignUp from './pages/auth/signUp/signUp'
import VerifyOtp from './pages/auth/otp/verifyOtp'
import CreateProduct from './pages/cms/product_create/createProduct'
import { useDispatch, useSelector } from 'react-redux';
import { check_token } from "../redux-toolkit/Slice/auth.slice";
import Dashboard from "./pages/cms/dashboard/dashboard";
const Update = lazy(() => import("./pages/cms/update/update"));

function App() {


  const { isAuthenticated } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  function PrivateRoute({ children }) {
    //console.log(children, "children");
    const token =
      localStorage.getItem("user_token") ||
      sessionStorage.getItem("user_token");

    return token !== null && token !== undefined ? (
      children
    ) : (
      <>
        <Navigate to="/" />
        {alert("Please go for login either you can't access product list")}
      </>
    );
  }
  const PublicRouteNames = [
    {
      path: "/",
      Component: <LogIn />,
    },
    {
      path: "/auth/signup",
      Component: <SignUp />,
    },

    {
      path: "/auth/otp",
      Component: <VerifyOtp/>,
    }
  ];

  const PrivateRouteNames = [
    // {
    //   path: "/auth/updatePassword",
    //   Component: <UpdatePassword />,
    // },
    {
      path: "/cms/dashboard",
      Component: <Dashboard/>,
    },
    {
      path: "/cms/product_create",
      Component: <CreateProduct/>,
    },
    {
      path: "/cms/edit/:id",
      Component: <Update />,
    },
  ];

  
  useEffect(() => {
    dispatch(check_token());
  }, [dispatch]);

  return (
    <>
      <div className="App">
        <Suspense fallback={<h1>Loading....</h1>}>
          <Router>
          {isAuthenticated && <Header />}
            <Routes>
              {PublicRouteNames?.map((route) => {
                return (
                  <Route exact path={route.path} element={route.Component} />
                );
              })}

              {PrivateRouteNames?.map((route) => {
                return (
                  <Route
                    path={route.path}
                    element={<PrivateRoute>{route.Component}</PrivateRoute>}
                  />
                );
              })}
            </Routes>
            {/* <Footer /> */}
          </Router>
        </Suspense>
      </div>
    </>
  )
}

export default App
