import { Navigate } from 'react-router-dom';

function Protected({ isAuth, children }) {
  // if user is not logged in then it will direct him to a login page & react will automatically pass children
  if (isAuth) {
    return children;
  } else {
    return <Navigate to='/login' />;
  }
}

export default Protected;
