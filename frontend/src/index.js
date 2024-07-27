import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Blog from "./Pages/Blog";
import BlogDetail from "./Pages/BlogDetail";
import BlogList from "./Pages/BlogList";
import Product from "./Pages/Product";
import Basket from "./Pages/Basket.jsx";
import Header from "./componet/Header.jsx";
import Footer from "./componet/Footer.jsx";
import HowWrokPage from "./componet/HowWrokPage.jsx";
import SuccessPage from "./Pages/SuccessPage.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Appceptance from "./Pages/Acceptance.jsx";
import Terms from "./Pages/Terms.jsx";
import Packaging from "./Pages/Packaging.jsx";
import AboutUs from "./Pages/AboutUs.jsx";
import Contact from "./Pages/Contact.jsx";
import Details from "./Pages/Details.jsx";
import SignUpForm from "./Pages/Signin.jsx";
import Login from "./Pages/Login.jsx";
import Admin from "./Pages/Admin.jsx";
import PrivacyStatement from "./Pages/PrivacyStatement.jsx";
import PasswordReset from "./Pages/PasswordReset.jsx/PasswordReset.jsx";
import ChangePassword from "./componet/ChangePassword.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import CustomerOffers from "./Pages/CustomerOffers.jsx";
import UserBlog from "./Pages/UserBlog.jsx";
import BlogEdit from "./Pages/BlogEdit.jsx";
import UserManagement from "./Pages/UserManagement.jsx";
import UserCategory from "./Pages/UserCategory.jsx";
import UserComments from "./Pages/UserComments.jsx";
import Conditions from "./Pages/Conditions.jsx";
import AdminRoute from "./AdminRoute.jsx";
import ReactGA from "react-ga4";
import CustomerOffer from "./customerOffer.jsx";
import axios from "axios";
import baseUrl from "./context/baseUrl.js";
const storedUserId = localStorage.getItem("userId");
const adminView = localStorage.getItem("adminView");
const TRACKING_ID = "G-322ELRCXBL";
ReactGA.initialize(TRACKING_ID);
// let router = createBrowserRouter(
//   [
//   {
//     path: "",
//     element: (
//       <div className=" flex min-h-screen flex-col ">
//         <Header />
//         <App />
//         <Footer />
//       </div>
//     ),
//   },
//   {
//     path: "/signup/",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         <SignUpForm />
//         <Footer />
//       </div>
//     ),
//   },
//   {
//     path: "/Admin/",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         {/* {isAdmin ? <Admin /> : <div>Unauthorization Persn Not allow</div>} */}
//         {/* {adminView === "admin" ? <Admin /> : <Navigate to={"/"} />} */}
//         <Admin />

//         <Footer />
//       </div>
//     ),
//   },
//   {
//     path: "/login/",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         <Login />
//         <Footer />
//       </div>
//     ),
//   },
//   {
//     path: "/product",
//     element: (
//       <div className=" flex min-h-screen flex-col ">
//         <Header />
//         <Product />
//         <Footer />
//       </div>
//     ),
//   },
//   {
//     path: "/selling-basket",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         <Basket />
//         <Footer />
//       </div>
//     ),
//   },
//   {
//     path: "/check-your-details",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         <Details />
//         <Footer />
//       </div>
//     ),
//   },
//   {
//     path: "/how-it-works",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         <HowWrokPage />
//         <Footer />
//       </div>
//     ),
//   },
//   {
//     path: "/success",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         <SuccessPage />
//         <Footer />
//       </div>
//     ),
//   },
//   {
//     path: "/my-account",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />

//         <Dashboard />

//         <Footer />
//       </div>
//     ),
//   },
//   {
//     path: "/Conditions",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />

//         <Conditions />

//         <Footer />
//       </div>
//     ),
//   },
//   {
//     path: "/terms-and-conditions",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         <Terms />
//         <Footer />
//       </div>
//     ),
//   },
//   {
//     path: "/acceptance-guidelines",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         <Appceptance />
//         <Footer />
//       </div>
//     ),
//   },
//   {
//     path: "/packaging-guidelines",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         <Packaging />
//         <Footer />
//       </div>
//     ),
//   },
//   {
//     path: "/about",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         <AboutUs />
//         <Footer />
//       </div>
//     ),
//   },
//   {
//     path: "/Contact",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         <Contact />
//         <Footer />
//       </div>
//     ),
//   },

//   {
//     path: "/blogs",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         <Blog />
//         <Footer />
//       </div>
//     ),
//   },


//   {
//     path: "/blogdetails",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         <BlogDetail />
//         <Footer />
//       </div>
//     ),
//   },


//   {
//     path: "/bloglist",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         <BlogList />
//         <Footer />
//       </div>
//     ),
//   },




//   {
//     path: "/privacy-statement",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         <PrivacyStatement />
//         <Footer />
//       </div>
//     ),
//   },
//   {
//     path: "/forgotpassword/:id/:token",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         <PasswordReset />
//         <Footer />
//       </div>
//     ),
//   },
//   {
//     path: "/forgot-password",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         <ChangePassword />
//         <Footer />
//       </div>
//     ),
//   },
//   {
//     path: "/AdminDashboard",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         <AdminRoute />
//         <Footer />
//       </div>
//     ),
//   },
//   {
//     path: "/customeroffers",
//     element: (
//       <div className="h-screen flex min-h-screen flex-col ">
//         <Header />
//         <CustomerOffer />
//         <Footer />
//       </div>
//     ),
//   },

//   {
//   path: "/userblogs",
//   element: (
//     <div className="h-screen flex min-h-screen flex-col ">
//       <Header />
//       <UserBlog />
//       <Footer />
//     </div>
//   ),
// },

// {
//   path: "/blogedit",
//   element: (
//     <div className="h-screen flex min-h-screen flex-col ">
//       <Header />
//       <BlogEdit />
//       <Footer />
//     </div>
//   ),
// },



// {
//   path: "/usermanagement",
//   element: (
//     <div className="h-screen flex min-h-screen flex-col ">
//       <Header />
//       <UserManagement />
//       <Footer />
//     </div>
//   ),
// },

// {
//   path: "/usercategory",
//   element: (
//     <div className="h-screen flex min-h-screen flex-col ">
//       <Header />
//       <UserCategory />
//       <Footer />
//     </div>
//   ),
// },


// {
//   path: "/usercomments",
//   element: (
//     <div className="h-screen flex min-h-screen flex-col ">
//       <Header />
//       <UserComments />
//       <Footer />
//     </div>
//   ),
// },



// ])
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//     {/* <App /> */}
//   </React.StrictMode>
// )






function AppRouter() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/user/${storedUserId}`);
        setUserData(response.data);
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setLoading(false);
      }
    };

    if (storedUserId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  let router = createBrowserRouter(
    [
      {
        path: "",
        element: (
          <div className=" flex min-h-screen flex-col ">
            <Header />
            <App />
          </div>
        ),
      },
      {
        path: "/signup/",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            <SignUpForm />
            <Footer />
          </div>
        ),
      },
      {
        path: "/Admin/",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            {/* {isAdmin ? <Admin /> : <div>Unauthorization Persn Not allow</div>} */}
            {/* {adminView === "admin" ? <Admin /> : <Navigate to={"/"} />} */}
            {!loading && (userData?.admin === "admin" ? <Admin /> : <Navigate to="/" />)}


            <Footer />
          </div>
        ),
      },
      {
        path: "/login/",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            <Login />
            <Footer />
          </div>
        ),
      },
      {
        path: "/product",
        element: (
          <div className=" flex min-h-screen flex-col ">
            <Header />
            <Product />
            <Footer />
          </div>
        ),
      },
      {
        path: "/selling-basket",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            <Basket />
            <Footer />
          </div>
        ),
      },
      {
        path: "/check-your-details",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            <Details />
            <Footer />
          </div>
        ),
      },
      {
        path: "/how-it-works",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            <HowWrokPage />
            <Footer />
          </div>
        ),
      },
      {
        path: "/success",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            <SuccessPage />
            <Footer />
          </div>
        ),
      },
      {
        path: "/my-account",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />

            <Dashboard />

            <Footer />
          </div>
        ),
      },
      {
        path: "/Conditions",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />

            <Conditions />

            <Footer />
          </div>
        ),
      },
      {
        path: "/terms-and-conditions",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            <Terms />
            <Footer />
          </div>
        ),
      },
      {
        path: "/acceptance-guidelines",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            <Appceptance />
            <Footer />
          </div>
        ),
      },
      {
        path: "/packaging-guidelines",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            <Packaging />
            <Footer />
          </div>
        ),
      },
      {
        path: "/about",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            <AboutUs />
            <Footer />
          </div>
        ),
      },
      {
        path: "/Contact",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            <Contact />
            <Footer />
          </div>
        ),
      },

      {
        path: "/blogs",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            <Blog />
            <Footer />
          </div>
        ),
      },


      {
        path: "/blogdetails",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            <BlogDetail />
            <Footer />
          </div>
        ),
      },


      {
        path: "/bloglist",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            <BlogList />
            <Footer />
          </div>
        ),
      },




      {
        path: "/privacy-statement",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            <PrivacyStatement />
            <Footer />
          </div>
        ),
      },
      {
        path: "/forgotpassword/:id/:token",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            <PasswordReset />
            <Footer />
          </div>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            <ChangePassword />
            <Footer />
          </div>
        ),
      },
      {
        path: "/AdminDashboard",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            {!loading && (userData?.admin === "admin" ? <AdminRoute /> : <Navigate to="/" />)}
            <Footer />
          </div>
        ),
      },
      {
        path: "/customeroffers",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            <CustomerOffer />
            <Footer />
          </div>
        ),
      },

      {
        path: "/userblogs",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            {!loading && (userData?.admin === "admin" ? <UserBlog /> : <Navigate to="/" />)}
            <Footer />
          </div>
        ),
      },

      {
        path: "/blogedit",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            {!loading && (userData?.admin === "admin" ? <BlogEdit /> : <Navigate to="/" />)}
            <Footer />
          </div>
        ),
      },



      {
        path: "/usermanagement",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            {!loading && (userData?.admin === "admin" ? <UserManagement /> : <Navigate to="/" />)}
            <Footer />
          </div>
        ),
      },

      {
        path: "/usercategory",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            {!loading && (userData?.admin === "admin" ? <UserCategory /> : <Navigate to="/" />)}
            <Footer />
          </div>
        ),
      },


      {
        path: "/usercomments",
        element: (
          <div className="h-screen flex min-h-screen flex-col ">
            <Header />
            {!loading && (userData?.admin === "admin" ? <UserComments /> : <Navigate to="/" />)}
            <Footer />
          </div>
        ),
      },



    ]);

  if (loading) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastContainer />
    <AppRouter />
  </React.StrictMode>
);