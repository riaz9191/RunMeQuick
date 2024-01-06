import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Provider/AuthProvider';
import Spinner from '../Pages/Shared/Spinner';

const PrivateRoutes = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();
    console.log('private routes')
    if (loading) {
        return (
          <Spinner className="text-center" animation="border" variant="primary" />
        );
      }
      if (user) {
        return children;
      }
    return <Navigate to="/login" state={{ from: location.pathname }} replace></Navigate>;
};

export default PrivateRoutes;