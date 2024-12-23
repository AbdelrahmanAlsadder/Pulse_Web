//This code is responsible for managing the routing in the application,
//  dividing routes into two categories: public routes
//  (accessible without authentication) and 
// auth-protected routes (requiring authentication).
//  The Index component uses React Router to define the structure of the routes.



import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { authProtectedRoutes, publicRoutes } from './allRoutes';  // Import routes configuration for public and auth-protected routes
import NonAuthLayout from '../Layout/NonAuthLayout';  // Layout for non-authenticated routes
import { AuthProtected } from './AuthProtected';  // Component to protect routes that need authentication
import Layout from '../Layout';  // Layout for authenticated routes

const Index = () => {
  return (
    <React.Fragment>
      <Routes>  {/* The Routes component is used to define route mappings */}
        {/* Public Routes (no authentication required) */}
        <Route>
          {
            publicRoutes.map((route: any, idx: any) => (  // Loop over publicRoutes array to render route components
              <Route
                key={idx}  // Unique key for each route
                path={route.path}  // The URL path for the route
                element={<NonAuthLayout> {route.component} </NonAuthLayout>}  // Render the route inside the NonAuthLayout
              />
            ))
          }
        </Route>

        {/* Auth Protected Routes (authentication required) */}
        <Route>
          {
            authProtectedRoutes.map((route: any, idx: number) => (  // Loop over authProtectedRoutes array to render protected route components
              <Route
                key={idx}  // Unique key for each route
                path={route.path}  // The URL path for the route
                element={<AuthProtected> <Layout>{route.component}</Layout> </AuthProtected>}  // Render route inside AuthProtected and Layout components
              />
            ))
          }
        </Route>
      </Routes>
    </React.Fragment>
  );
};

export default Index;
