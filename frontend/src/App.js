import './App.scss';
import { Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import RegisterForm from './pages/RegisterForm';
import LoginForm from './pages/LoginForm';
import 'bootstrap/dist/js/bootstrap';
import WorkoutDiary from './pages/WorkoutDiary';
import ProfileForm from './pages/ProfileForm';
import AddNewWorkout from './pages/AddNewWorkout';
import ProtectedRoute from './components/ProtectedRoute';
import { UserContext } from './contexts/UserContext';
import AdminRoute from './components/Admin/AdminRoute';
import NotAdmin from './components/Admin/NotAdmin';
import NotFound from './pages/NotFound';
import SportTypes from './pages/Admin/SportTypes';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Footer from './components/Footer';
import ArticlePage from './pages/ArticlePage';

function App() {
  const { loggedInUser } = useContext(UserContext);
  return (
    <div>
      <div className="main-content welcomeWallpaper">
        <Header />
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="-" element={<NotAdmin />} />
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/articles" element={<ArticlePage />} />
          <Route path="/termsandconditions" element={<TermsAndConditions />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />

          <Route element={<ProtectedRoute user={loggedInUser} redirectPath="/login" />}>
            <Route path="/workout" element={<AddNewWorkout />} />
            <Route path="/diary" element={<WorkoutDiary />} />
            <Route path="/profile" element={<ProfileForm />} />
          </Route>
          {loggedInUser && (
            <Route element={<AdminRoute admin={loggedInUser.isAdmin} />}>
              <Route path="/admin/sports" element={<SportTypes />} />
            </Route>
          )}
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
