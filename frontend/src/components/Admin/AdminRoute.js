import { Outlet } from 'react-router-dom';
import NotAdmin from './NotAdmin';

export default function ProtectedRoute({ admin, children }) {
  if (!admin) {
    return <NotAdmin />;
  }

  return children || <Outlet />;
}
