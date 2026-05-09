import { Navigate } from "react-router-dom";

function PrivateRoute ( { children, allowedRoles } ) {
  const user = JSON.parse(localStorage.getItem("USER"));

  if (!user ) {
   
    return <Navigate  to="/" />;
  }

  if ( !allowedRoles.includes(user.role)) 
    {
    
     return <Navigate  to="/"   />;
  }

  return  children;
}

export default  PrivateRoute;