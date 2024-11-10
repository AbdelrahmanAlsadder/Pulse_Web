import { Navigate } from "react-router-dom";

// Dashboard

import Dashboard from "../pages/Dashboard/Index";
import Signin from "../pages/AuthenticationInner/Signin";
import Signup from "../pages/AuthenticationInner/Signup";
import PasswordReset from "../pages/AuthenticationInner/PasswordReset";
import Lockscreen from "../pages/AuthenticationInner/Lockscreen";
import AddInvoice from "../pages/InvoiceManagement/AddInvoice/index";
import InvoiceDetails from "../pages/InvoiceManagement/InvoiceDetails/index";
import AddProduct from "../pages/InvoiceManagement/AddProduct";
import Invoice from "../pages/InvoiceManagement/Invoice/index";
import ProductList from "../pages/InvoiceManagement/ProductList";
import Orders from "../pages/InvoiceManagement/Orders";
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import ForgotPassword from "../pages/Authentication/ForgotPassword";
import Register from "../pages/Authentication/Register";
import UserProfile from "../pages/Authentication/UserProfile";
import OrderDetails from "../pages/InvoiceManagement/OrderDetails";
import Users from "../pages/InvoiceManagement/Users";

interface RouteObject {
  path: string;
  component: any;
  exact?: boolean;
}

const authProtectedRoutes: Array<RouteObject> = [
  // Dashboard
  { path: "/index", component: <Dashboard /> },
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/user", component: <Users /> },

  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  { path: "*", component: <Navigate to="/dashboard" /> },

  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  { path: "*", component: <Navigate to="/dashboard" /> },

  { path: "/invoice", component: <Invoice /> },
  { path: "/invoice-add", component: <AddInvoice /> },
  { path: "/invoice-details/:orderId", component: <InvoiceDetails /> },
  { path: "/product-add", component: <AddProduct /> },
  { path: "/product-list", component: <ProductList /> },
  { path: "/orders", component: <Orders /> },
  { path: "/OrderDetails/:orderId", component: <OrderDetails /> },


  

  //  Profile
  { path: "/user-profile", component: <UserProfile /> },
];

const publicRoutes: Array<RouteObject> = [
  { path: "/login", component: <Login /> },
  { path: "/logout", component: <Logout /> },
  { path: "/forgot-password", component: <ForgotPassword /> },
  { path: "/register", component: <Register /> },

  { path: "/auth-signin", component: <Signin /> },
  { path: "/auth-signup", component: <Signup /> },
  { path: "/auth-pass-reset", component: <PasswordReset /> },
  { path: "/auth-lockscreen", component: <Lockscreen /> },
];

export { authProtectedRoutes, publicRoutes };
