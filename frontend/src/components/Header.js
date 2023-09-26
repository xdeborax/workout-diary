import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightToBracket,
  faUserPen,
  faUser,
  faPersonWalkingArrowRight,
  faFeather,
  faEllipsisVertical,
  faDumbbell,
  faBookBookmark,
  faGear,
  faNewspaper,
} from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import './Header.scss';

export default function Header() {
  const { loggedInUser, logOutUser } = useContext(UserContext);

  const login = <FontAwesomeIcon icon={faRightToBracket} />;
  const register = <FontAwesomeIcon icon={faUserPen} />;
  const profile = <FontAwesomeIcon icon={faUser} />;
  const logout = <FontAwesomeIcon icon={faPersonWalkingArrowRight} />;
  const ellipsis = <FontAwesomeIcon icon={faEllipsisVertical} />;
  const feather = <FontAwesomeIcon icon={faFeather} />;
  const dumbell = <FontAwesomeIcon icon={faDumbbell} />;
  const diary = <FontAwesomeIcon icon={faBookBookmark} />;
  const gear = <FontAwesomeIcon icon={faGear} />;
  const blog = <FontAwesomeIcon icon={faNewspaper} />;

  return (
    <header className="site-header">
      <nav className="nav-container navigation navbar navbar-expand-lg">
        <div className="container-fluid mx-3">
          <NavLink className="navbar-brand pb-0" to="/">
            <div id="brand-name">
              <i>{feather}</i>
              <span className="mx-2">
                Workout
                {' '}
                <span className="diary-text">
                  Diary
                </span>
                {' '}
              </span>
            </div>
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fa-duotone">{ellipsis}</i>

          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav mb-2 mb-lg-0 gap-2" id="nav-list">
              {loggedInUser ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/workout">
                      Edzés hozzáadása
                      {' '}
                      <i className="ms-2">{dumbell}</i>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/diary">
                      Edzésnapló
                      {' '}
                      <i className="ms-2">{diary}</i>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/profile">
                      Profil
                      {' '}
                      <i className="ms-2">{profile}</i>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/articles">
                      Cikkek
                      {' '}
                      <i className="ms-2">{blog}</i>
                    </NavLink>
                  </li>
                  {loggedInUser.isAdmin && (
                    <li className="nav-item">
                      <div className="dropdown">
                        <NavLink
                          className="dropdown-toggle nav-link"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          id="dropDownButton"
                        >
                          <i className="me-1">{gear}</i>
                          {' '}
                          Admin
                        </NavLink>
                        <ul className="dropdown-menu m-0">
                          <li><NavLink className="dropdown-item" to="/admin/sports">Sport típusok</NavLink></li>
                        </ul>
                      </div>
                    </li>
                  )}
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/"
                      onClick={logOutUser}
                    >
                      Kijelentkezés
                      {' '}
                      <i>{logout}</i>
                    </NavLink>
                  </li>

                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/articles">
                      Cikkek
                      {' '}
                      <i className="ms-2">{blog}</i>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/login"
                    >
                      Bejelentkezés
                      {' '}
                      <i>{login}</i>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/register">
                      Regisztráció
                      {' '}
                      <i className="ms-2">{register}</i>
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
