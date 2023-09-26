import { NavLink } from 'react-router-dom';
import './Footer.scss';

export default function Footer() {
  return (
    <footer className="footer mt-auto py-3 bg-dark">
      <div className="container">
        <span className="text-body-secondary footer-text">
          <span className="me-2">2023 © WorkoutDiary</span>
          {' | '}
          <span className="mx-2">workoutdiary@gmail.com</span>
          {' | '}
          <NavLink to="/termsandconditions" className="mx-2">Felhasználási feltételek</NavLink>
          {' | '}
          {' '}
          <NavLink to="/privacypolicy" className="ms-2">Adatvédelem és adatkezelés</NavLink>
        </span>
      </div>
    </footer>
  );
}
